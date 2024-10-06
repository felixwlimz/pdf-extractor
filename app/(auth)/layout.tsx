import React, { ReactNode } from 'react'

const AuthLayout = ({children} : { children : ReactNode}) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center p-2">
        {children}
    </div>
  )
}

export default AuthLayout