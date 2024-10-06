import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {Avatar} from "@nextui-org/react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const PostLoader = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  return (
    <div className='md:min-w-[470px] max-w-[470px] flex flex-col gap-y-2 p-4 font-roboto'>
                <div className='flex flex-row justify-start items-center cursor-pointer gap-x-5'>
                    <Skeleton className='h-8 w-8 rounded-full'/>
                    <div className='flex flex-col h-8 justify-center'>
                        <Skeleton className='w-[100px]'/>
                        <Skeleton className='w-[50px]'/>

                    </div>
        </div>
        <Skeleton className='w-[468px] h-[400px]'/>
    </div>
  )
}

export default PostLoader