declare module 'bootstrap' {
  export class Modal {
    constructor(element: any, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    static getInstance(element: any): Modal | null;
  }
}
