import Image from 'next/image'
import { useState, useEffect } from "react"
import styles from '../styles/Home.module.css'


export default function Carousel() {
  const [ currentIndex, setCurrentIndex ] = useState(1);
  const [ imgSrc, setImgSrc ] = useState("");
  const MAX_INDEX = 6;

  useEffect(() => {
    setTimeout(nextImg, 500);
    getSrc();
  }, [currentIndex]);

  const getSrc = () => {
    if(currentIndex > MAX_INDEX) {
      setCurrentIndex(1);
    } else if(currentIndex < 1) {
      setCurrentIndex(MAX_INDEX);
    }

    setImgSrc(`/generated/devbear${currentIndex}.png`);
  }

  const nextImg = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  }

  return (
    <section>
      {imgSrc && <Image src={imgSrc} alt="Generated Dev Bear Image" width={395} height={308} />}
    </section>
  )
}