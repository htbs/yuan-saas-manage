import React from "react";
import {useHome} from "@src/features/home/useHome";


const Home = () => {
    const {description} = useHome()
    return (
        <div className="App">
            <div className="flex justify-center items-center bg-blue-200 w-20 h-20 text-4xl ">
                { description }
            </div>
        </div>
    )
};

export default Home;
