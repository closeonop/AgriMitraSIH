"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
    "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
    "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
    "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
    "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
    "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
    "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
    "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
    "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
    "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
    "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
    "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
    "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
    "M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707",
    "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
    "M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691",
    "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
    "M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675",
  ];

  const [pathLengths, setPathLengths] = useState<number[]>([]);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const lengths = paths.map((_, index) => {
        const path = ref.current?.querySelector(`#path-${index}`) as SVGPathElement;
        return path?.getTotalLength() || 0;
      });
      setPathLengths(lengths);
    }
  }, []);

  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      <svg
        ref={ref}
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {paths.map((path, index) => (
          <motion.path
            key={index}
            id={`path-${index}`}
            d={path}
            stroke="url(#gradient)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            initial={{
              strokeDasharray: pathLengths[index] || 0,
              strokeDashoffset: pathLengths[index] || 0,
            }}
            animate={{
              strokeDashoffset: 0,
            }}
            transition={{
              duration: 2,
              delay: index * 0.1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 3,
            }}
          />
        ))}
      </svg>
    </div>
  );
};