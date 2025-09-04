import React from 'react'
import { importElectorates } from './actions'

// 選舉人名冊管理頁面
export default function ElectoratesPage() {
  return (
    <div className="p-4 max-w-lg flex flex-col gap-4">
      <h1 className="text-2xl font-bold">選舉人名冊管理</h1>
      {/* 提供簡單的文字區塊供匯入使用 */}
      <form action={importElectorates} className="flex flex-col gap-2">
        <textarea
          name="students"
          placeholder="輸入學生學號，可用換行或逗號分隔"
          className="border p-2 h-40"
        />
        <button type="submit" className="bg-green-600 text-white px-2 py-1">
          匯入名單
        </button>
      </form>
    </div>
  )
}
