import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from 'utils/loggers';

export class HttpUtil {
    /**
     * 获取重定向后的真实链接
     * @param url
     * @param headers
     * @returns
     */
    static async getRealLocationFromMidLink(
        url: string,
        headers?: any,
    ): Promise<AxiosResponse<any, any>> {
        try {
            const response = await axios.get(url, {
                headers,
                maxRedirects: 0,
            });

            return response;
        } catch (error: any) {
            if (error.response && error.response.status === 302) {
                return error.response;
            }

            logger.error('Error occurred while making a GET Raw request', error);
            throw error;
        }
    }

    static async get(
        url: string,
        option: AxiosRequestConfig<any>,
    ): Promise<AxiosResponse<any, any>['data']> {
        try {
            const response = await axios.get(url, option);
            return response.data;
        } catch (error) {
            logger.error('Error occurred while making a GET request', error);
            throw error;
        }
    }

    static async post(
        url: string,
        data: any,
        headers: any,
    ): Promise<AxiosResponse<any, any>['data']> {
        try {
            const response = await axios.post(url, data, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            logger.error('Error occurred while making a POST request', error);
            throw error;
        }
    }
}
