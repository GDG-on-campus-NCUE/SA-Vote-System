import Link from 'next/link'
import React from 'react'

// 管理後台首頁，提供各管理功能的入口
export default function AdminHome() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">超級管理員後台</h1>
      <ul className="list-disc pl-5">
        <li>
          <Link href="/admin/elections">選舉管理</Link>
        </li>
        <li>
          <Link href="/admin/users">角色管理</Link>
        </li>
        <li>
          <Link href="/admin/electorates">選舉人名冊管理</Link>
        </li>
      </ul>
    </div>
  )
}
