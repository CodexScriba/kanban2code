declare module 'gray-matter' {
  export interface GrayMatterFile<T = Record<string, unknown>> {
    content: string;
    data: T;
  }

  export interface GrayMatterStatic {
    <T = Record<string, unknown>>(input: string): GrayMatterFile<T>;
    stringify(content: string, data: Record<string, unknown>): string;
  }

  const matter: GrayMatterStatic;
  export default matter;
}
