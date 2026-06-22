"use client";

import { FC, useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  // 마우스 드래그를 위한 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 스크롤 바 계산 로직
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    // 스크롤이 불가능한 경우 진행도를 0으로 초기화
    if (scrollWidth <= clientWidth) {
      setScrollProgress(0);
      return;
    }

    const maxScrollLeft = scrollWidth - clientWidth;
    const progress = scrollLeft / maxScrollLeft;

    // 0 ~ 1 사이의 진행도 저장
    setScrollProgress(progress);
  };

  useEffect(() => {
    const timer = setTimeout(() => handleScroll(), 100);
    window.addEventListener("resize", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleScroll);
    };
  }, [images]);

  // 마우스 드래그 이벤트
  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const onMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // 스크롤 민감도
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  if (images.length === 0) return null;

  // --- 인디케이터 크기 및 위치 계산 로직 ---
  const isIndicatorVisible = images.length > 3;

  // 스크롤 단계 수 (5장이면 3단계, 4장이면 2단계)
  const scrollSteps = images.length - 2;

  // 바의 너비 퍼센트 (5장이면 33.33%, 4장이면 50%)
  const indicatorWidthPercent = isIndicatorVisible
    ? (1 / scrollSteps) * 100
    : 0;

  // 바가 이동할 수 있는 최대 여백
  const maxLeftPercent = 100 - indicatorWidthPercent;

  // 현재 위치
  const currentLeftPercent = scrollProgress * maxLeftPercent;

  return (
    <div className="relative w-full flex flex-col">
      {/* 1. 슬라이더 영역 */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeaveOrUp}
        onMouseUp={onMouseLeaveOrUp}
        onMouseMove={onMouseMove}
        className={`flex gap-7.75 w-full overflow-x-auto hide-scrollbar ${
          // 드래그 중일 때는 자연스러운 움직임을 위해 snap을 잠시 끕니다.
          isDragging
            ? "cursor-grabbing snap-none"
            : "cursor-grab scroll-snap-type-x mandatory"
        }`}
      >
        {images.map((imgSrc, index) => (
          <div
            key={index}
            className="relative shrink-0 w-116.5 h-116.75 scroll-snap-align-start bg-gray-100"
          >
            <Image
              src={imgSrc}
              alt={`이미지 ${index + 1}`}
              fill
              className="object-cover"
              draggable={false}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* 2. 슬라이드 인디케이터 바 (3개 초과일 때만 노출) */}
      {isIndicatorVisible && (
        <div className="relative w-full h-0.5 bg-gray-300 mt-9.5">
          <div
            className="absolute top-0 h-full bg-gray-900 transition-all duration-75 ease-out"
            style={{
              width: `${indicatorWidthPercent}%`,
              left: `${currentLeftPercent}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
