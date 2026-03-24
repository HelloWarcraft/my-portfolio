import React, { useState, useEffect, useRef } from 'react';
import { 
  Wand2, 
  Image as ImageIcon 
} from 'lucide-react';

// --- 数据区 ---
const BASE_IMG_URL = "https://cnb.cool/catfishzone/san-guo_agents/-/git/raw/main/task-002-imgs/";

// 抽取了约50%（126位）战国人物作为展示作品
const SELECTED_CHARACTERS = [
  "000_楚怀王", "002_楚考烈王", "004_楚哀王", "006_熊启", "008_景翠", "010_屈原", "012_昭鱼", "014_靳尚", "016_庄辛", "018_淖齿", "020_临武君", "022_李园", "024_朱英",
  "025_项燕", "027_范增", "029_庄蹻", "031_景差", "033_韩襄王", "035_韩桓惠王", "037_陈筮", "039_韩公叔", "041_暴鸢", "043_韩侈", "045_张开地", "047_张平", "049_韩阳",
  "050_韩非", "052_张良", "054_韩明", "056_韩熙", "058_齐襄王", "060_君王后", "062_匡章", "064_田文", "066_触子", "068_田骈", "070_吕礼", "072_太史敫", "074_苏厉",
  "075_貂勃", "077_王孙贾", "079_邹克", "081_谭拾子", "083_鲁仲连", "085_秦昭襄王", "087_秦庄襄王", "089_芈八子", "091_魏冉", "093_嬴悝", "095_任鄙", "097_李崇", "099_寿烛",
  "100_范雎", "102_杜仓", "104_甘罗", "106_顿弱", "108_茅焦", "110_赵高", "112_赵成", "114_冯去疾", "116_蒙毅", "118_白起", "120_尉缭", "122_郑安平", "124_张唐",
  "125_胡阳", "127_蒙骜", "129_桓齮", "131_杨端和", "133_李信", "135_羌瘣", "137_冯毋择", "139_司马欣", "141_嫪毐", "143_魏襄王", "145_魏安釐王", "147_魏王假", "149_芒卯",
  "150_魏齐", "152_龙阳君", "154_唐雎", "156_范座", "158_孔斌", "160_新垣衍", "162_朱亥", "164_陈余", "166_薛公", "168_燕昭王", "170_燕武成王", "172_燕王喜", "174_张魁",
  "175_乐毅", "177_秦开", "179_公孙操", "181_剧辛", "183_蔡鸟", "185_卿秦", "187_鞠武", "189_田光", "191_荆轲", "193_燕市狗屠", "195_赵惠文王", "197_赵悼襄王", "199_代王嘉",
  "200_肥义", "202_田不礼", "204_公子成", "206_赵威后", "208_长安君", "210_许历", "212_傅抵", "214_庞煖", "216_赵豹", "218_缪贤", "220_虞卿", "222_皮相国", "224_建信君",
  "225_赵敖", "227_唐玖", "229_楼昌", "231_苏射", "233_王容", "235_司马尚", "237_颜聚", "239_乐乘", "241_魏加"
];

const portfolioItems = SELECTED_CHARACTERS.map((item, index) => {
  const name = item.split('_')[1];
  return {
    id: item,
    title: name,
    category: "AI辅助原画设计",
    imgUrl: `${BASE_IMG_URL}${item}.png`,
    delay: (index % 4) * 150 // 用于交错动画
  };
});

// --- 自定义 Hooks ---
// 用于监听元素是否进入视口，实现滚动渐显动画
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // 一旦显示，就取消观察，保持显示状态
        if (targetRef.current) observer.unobserve(targetRef.current);
      }
    }, { threshold: 0.1, ...options });

    const currentRef = targetRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [targetRef, isIntersecting];
};

// --- 组件区 ---

// 渐显动画容器组件
const FadeIn = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const baseClasses = "transition-all duration-1000 ease-out";
  const hiddenClasses = {
    up: "opacity-0 translate-y-12",
    down: "opacity-0 -translate-y-12",
    left: "opacity-0 translate-x-12",
    right: "opacity-0 -translate-x-12",
    none: "opacity-0 scale-95"
  };
  
  const visibleClasses = "opacity-100 translate-y-0 translate-x-0 scale-100";

  return (
    <div 
      ref={ref} 
      className={`${baseClasses} ${isVisible ? visibleClasses : hiddenClasses[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// 作品卡片组件
const PortfolioCard = ({ item }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl aspect-[636/900] cursor-pointer">
      {/* 骨架屏底色 */}
      <div className="absolute inset-0 bg-zinc-800 animate-pulse"></div>
      
      <img 
        src={item.imgUrl} 
        alt={item.title} 
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-10"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = "https://via.placeholder.com/636x900/18181b/f59e0b?text=Image+Not+Found";
        }}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-20"></div>
      
      {/* 悬浮内容 */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-30 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="text-amber-400 text-xs font-semibold tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 border border-amber-400/30 bg-amber-400/10 w-max px-2 py-1 rounded">
          {item.category}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h3>
        
        {/* 装饰线条 */}
        <div className="w-0 h-0.5 bg-amber-500 group-hover:w-12 transition-all duration-700 ease-out delay-200 mt-2"></div>
      </div>
    </div>
  );
};

// 主应用组件 (极简画廊)
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-amber-500/30 selection:text-amber-200 py-16 md:py-24">
      <div className="container mx-auto px-6">
        
        {/* 头部信息区 */}
        <FadeIn>
          <div className="mb-16 border-b border-white/10 pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            
            {/* 个人介绍 */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">王道爵士</h1>
              <p className="text-zinc-400 text-lg md:text-xl font-light mb-6">pengfeiwu@zju.edu.cn</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-amber-400 text-sm font-semibold tracking-widest">
                <Wand2 size={16} />
                <span>视觉设计师</span>
              </div>
            </div>
            
            {/* 画廊介绍 */}
            <div className="max-w-2xl lg:text-right">
              <div className="flex items-center lg:justify-end gap-3 text-amber-500 mb-4">
                <ImageIcon size={20} />
                <span className="text-sm font-bold tracking-[0.2em] uppercase">AI-Assisted Artwork</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">战国风云录 <span className="text-zinc-600 font-light">| 角色原画</span></h2>
              <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                以历史为骨，结合现代 <span className="text-amber-400 font-medium">AI 生成与辅助设计技法</span>，重新诠释战国七雄时期君王与名臣武将的视觉风貌。
              </p>
            </div>
            
          </div>
        </FadeIn>

        {/* 瀑布流/网格布局区 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {portfolioItems.map((item) => (
            <FadeIn key={item.id} delay={item.delay} direction="up">
              <PortfolioCard item={item} />
            </FadeIn>
          ))}
        </div>
        
        {/* 极简底部 */}
        <FadeIn delay={300}>
          <div className="mt-20 text-center text-zinc-600 text-sm">
            © {new Date().getFullYear()} 王道爵士. All rights reserved.
          </div>
        </FadeIn>
      </div>
    </div>
  );
}