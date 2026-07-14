declare module 'express' {
  const express: any;
  export default express;
  export type Request = any;
  export type Response = any;
  export type Express = any;
}

declare module 'vite' {
  export function createServer(...args: any[]): any;
}

declare module 'path' {
  const path: any;
  export default path;
}

declare module 'fs' {
  const fs: any;
  export default fs;
}
