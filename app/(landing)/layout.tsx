const LandingLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return(
     <main className="h-full bg-[#111827] overflow-auto">
        <div className = "mx-auto max-w-screen-xl h-full w-full">
            {children}
        </div>
     </main>
     
//      <main className="h-full  overflow-auto flex">
//      <div className="flex-none md:w-[15%] h-full bg-red-500"></div>
//      <div className = "grow h-full w-100% md:w-[70%] bg-[#111827]">
//          {children}
//      </div>
//      <div className="flex-none md:w-[15%] h-full bg-red-500"></div>
//   </main>   
    )
}

export default LandingLayout;