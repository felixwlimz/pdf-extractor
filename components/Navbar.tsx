import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 mb-10">
      <h3 className="font-semibold text-xl ml-4">PdfExtractor</h3>
      <button className="mr-4 font-semibold text-xl">Test</button>
      <button className="mr-4 font-semibold text-xl">Log in</button>
    </nav>
  );
}

export default Navbar