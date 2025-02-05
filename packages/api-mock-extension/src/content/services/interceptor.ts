import { MESSAGE_TYPES } from '@/common/constants';
import type { MockRule } from '@/background/interfaces/types';

export class RequestInterceptor {
  private static instance: RequestInterceptor;

  private constructor() {
    this.initXHRInterceptor();
    this.initFetchInterceptor();
  }

  static getInstance(): RequestInterceptor {
    if (!RequestInterceptor.instance) {
      RequestInterceptor.instance = new RequestInterceptor();
    }
    return RequestInterceptor.instance;
  }

  private async getMockRule(
    url: string,
    method: string
  ): Promise<MockRule | null> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: MESSAGE_TYPES.GET_MOCK,
          payload: { url, method },
        },
        (response) => {
          resolve(response as MockRule | null);
        }
      );
    });
  }

  private initXHRInterceptor() {
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;

    XHR.open = function (method: string, url: string) {
      (this as any)._method = method;
      (this as any)._url = url;
      (this as any)._requestHeaders = {};
      return open.apply(this, arguments as any);
    };

    XHR.setRequestHeader = function (header: string, value: string) {
      (this as any)._requestHeaders[header] = value;
      return setRequestHeader.apply(this, arguments as any);
    };

    XHR.send = async function (
      _data?: Document | XMLHttpRequestBodyInit | null
    ) {
      const xhr = this;
      const method = (xhr as any)._method;
      const url = (xhr as any)._url;

      try {
        const mockRule = await RequestInterceptor.instance.getMockRule(
          url,
          method
        );

        if (mockRule) {
          const { response, statusCode, headers, delay } = mockRule;

          setTimeout(() => {
            // 设置响应头
            if (headers) {
              Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value.toString());
              });
            }

            // 模拟响应
            Object.defineProperty(xhr, 'readyState', {
              get() {
                return 4;
              },
            });
            Object.defineProperty(xhr, 'status', {
              get() {
                return statusCode;
              },
            });
            Object.defineProperty(xhr, 'response', {
              get() {
                return typeof response === 'string'
                  ? response
                  : JSON.stringify(response);
              },
            });
            Object.defineProperty(xhr, 'responseText', {
              get() {
                return typeof response === 'string'
                  ? response
                  : JSON.stringify(response);
              },
            });

            xhr.dispatchEvent(new Event('readystatechange'));
            xhr.dispatchEvent(new Event('load'));
          }, delay || 0);

          return;
        }
      } catch (error) {
        console.error('Error in XHR interceptor:', error);
      }

      return send.apply(this, arguments as any);
    };
  }

  private initFetchInterceptor() {
    const originalFetch = window.fetch;

    window.fetch = async function (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      try {
        const request =
          input instanceof Request
            ? input
            : new Request(input.toString(), init);
        const url = request.url;
        const method = request.method;

        const mockRule = await RequestInterceptor.instance.getMockRule(
          url,
          method
        );

        if (mockRule) {
          const { response, statusCode, headers, delay } = mockRule;

          // 模拟延迟
          if (delay) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          // 创建模拟响应
          return new Response(
            typeof response === 'string' ? response : JSON.stringify(response),
            {
              status: statusCode,
              headers: new Headers(headers || {}),
            }
          );
        }
      } catch (error) {
        console.error('Error in fetch interceptor:', error);
      }

      return originalFetch.apply(window, arguments as any);
    };
  }
}
