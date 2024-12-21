export interface ICodeRenderStrategy {
  node: any;
  children: React.ReactNode;
  props: any;
  language: string;
  className: string;
}
