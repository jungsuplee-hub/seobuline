"use client";
export default function Error({reset}:{error:Error&{digest?:string};reset:()=>void}){return <div className="rounded border border-red-300 bg-red-50 p-8"><h2 className="font-semibold">오류가 발생했습니다.</h2><button onClick={reset} className="mt-3 rounded bg-red-600 px-3 py-1 text-white">다시 시도</button></div>;}
