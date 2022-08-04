/* eslint-disable @typescript-eslint/no-unused-vars */
export function debounce(fn:any, delay:any) {

     let timer:any;

     return function(...args:any){
            clearTimeout(timer);
            timer = setTimeout(()=> fn(args), delay)
     }
}