import React, { useEffect, useMemo, useRef, useState } from 'react';
import {  Bot,
  Crown,
  GalleryVerticalEnd,
  Mail,  Sparkles,
  SwatchBook,
} from 'lucide-react';
import './App.css';

const BASE_IMG_URL = 'https://cnb.cool/catfishzone/san-guo_agents/-/git/raw/main/task-002-imgs/';
const STATES = [
  {
    key: 'all',
    label: '全部',
    tone: '总览',
    names: [],
  },
  {
    key: 'chu',
    label: '楚',
    tone: '瑰丽深红',
    names: ['楚怀王', '楚顷襄王', '楚考烈王', '楚幽王', '楚哀王', '楚王负刍', '熊启', '昭阳', '景翠', '唐昧', '屈原', '召滑', '昭鱼', '子兰', '靳尚', '陈轸', '庄辛', '景阳', '淖齿', '景鲤', '临武君', '黄歇', '李园', '李嫣', '朱英', '项燕', '项梁', '范增', '汗明', '庄蹻', '宋玉', '景差', '唐勒'],
  },
  {
    key: 'han',
    label: '韩',
    tone: '墨金秩序',
    names: ['韩襄王', '韩釐王', '韩桓惠王', '韩王安', '陈筮', '公仲侈', '韩公叔', '韩公仲', '暴鸢', '韩聂', '韩侈', '韩辰', '张开地', '冯亭', '张平', '靳黈', '韩阳', '韩非', '内史腾', '张良', '史疾', '韩明', '韩博', '韩熙'],
  },
  {
    key: 'qi',
    label: '齐',
    tone: '青金理性',
    names: ['齐湣王', '齐襄王', '齐王建', '君王后', '田婴', '匡章', '齐貌辨', '田文', '冯谖', '触子', '达子', '田骈', '尹文', '吕礼', '王蠋', '太史敫', '田单', '苏厉', '貂勃', '苏秦', '王孙贾', '后胜', '邹克', '田璆', '谭拾子', '淳于越', '鲁仲连', '邹衍'],
  },
  {
    key: 'qin',
    label: '秦',
    tone: '鎏金黑曜',
    names: ['秦昭襄王', '秦孝文王', '秦庄襄王', '秦王政', '芈八子', '司马错', '魏冉', '芈戎', '嬴悝', '嬴芾', '任鄙', '向寿', '李崇', '李瑶', '寿烛', '范雎', '蔡泽', '杜仓', '吕不韦', '甘罗', '姚贾', '顿弱', '司空马', '茅焦', '李斯', '赵高', '阎乐', '赵成', '陈驰', '冯去疾', '冯劫', '蒙毅', '喜', '白起', '司马靳', '尉缭', '王龁', '郑安平', '王陵', '张唐', '胡阳', '王翦', '蒙骜', '蒙武', '桓齮', '樊於期', '杨端和', '王贲', '李信', '辛胜', '羌瘣', '蒙恬', '冯毋择', '章邯', '司马欣', '董翳', '嫪毐', '成蟜'],
  },
  {
    key: 'wei',
    label: '魏',
    tone: '琥珀暮色',
    names: ['魏襄王', '魏昭王', '魏安釐王', '魏景湣王', '魏王假', '公孙衍', '芒卯', '魏齐', '魏无忌', '龙阳君', '晋鄙', '唐雎', '须贾', '范座', '段干崇', '孔斌', '缩高', '新垣衍', '侯嬴', '朱亥', '张耳', '陈余', '毛公', '薛公', '魏牟'],
  },
  {
    key: 'yan',
    label: '燕',
    tone: '霜蓝锋芒',
    names: ['燕昭王', '燕惠王', '燕武成王', '燕孝王', '燕王喜', '太子丹', '张魁', '乐毅', '郭隗', '秦开', '骑劫', '公孙操', '荣蚠', '剧辛', '乐间', '蔡鸟', '栗腹', '卿秦', '将渠', '鞠武', '宋意', '田光', '高渐离', '荆轲', '秦舞阳', '燕市狗屠'],
  },
  {
    key: 'zhao',
    label: '赵',
    tone: '玉石银白',
    names: ['赵武灵王', '赵惠文王', '赵孝成王', '赵悼襄王', '赵幽缪王', '代王嘉', '肥义', '赵章', '田不礼', '李兑', '公子成', '富丁', '赵威后', '触龙', '长安君', '赵奢', '许历', '廉颇', '傅抵', '赵括', '庞煖', '李牧', '赵豹', '赵胜', '缪贤', '蔺相如', '虞卿', '毛遂', '皮相国', '希写', '建信君', '赵敖', '郭开', '唐玖', '韩仓', '楼昌', '郑朱', '苏射', '傅豹', '王容', '李同', '司马尚', '赵葱', '颜聚', '扈辄', '乐乘', '庆舍', '魏加', '李左车'],
  },
];

const HIGHLIGHTS = [
  '秦王政',
  '屈原',
  '韩非',
  '白起',
  '魏无忌',
  '乐毅',
  '蔺相如',
  '李牧',
];

const INTRO_METRICS = [
  { label: '角色原画', value: '242', note: '涵盖君王、文臣、武将' },
  { label: '设计方式', value: 'AI+', note: 'AI 设计与人工视觉统筹' },];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function buildCharacters() {
  let index = 0;

  return STATES.slice(1).flatMap((state) =>
    state.names.map((name) => {
      const code = String(index).padStart(3, '0');
      index += 1;
      return {
        id: `${code}_${name}`,
        code,
        name,
        stateKey: state.key,
        stateLabel: `${state.label}国`,
        tone: state.tone,
        image: `${BASE_IMG_URL}${code}_${encodeURIComponent(name)}.png`,
        note: 'AI设计角色原画',
      };
    }),
  );
}

const CHARACTERS = buildCharacters();

function App() {
  const [activeState, setActiveState] = useState('all');

  const featuredCharacters = useMemo(
    () => HIGHLIGHTS.map((name) => CHARACTERS.find((item) => item.name === name)).filter(Boolean),
    [],
  );

  const galleryCharacters = useMemo(() => {
    if (activeState === 'all') {
      return CHARACTERS;
    }

    return CHARACTERS.filter((item) => item.stateKey === activeState);
  }, [activeState]);

  return (
    <div className="page-shell">
      <div className="page-noise" aria-hidden="true" />
      <header className="hero">
        <div className="hero-backdrop hero-backdrop-left" aria-hidden="true" />
        <div className="hero-backdrop hero-backdrop-right" aria-hidden="true" />

        <Reveal className="hero-grid">
          <div className="hero-copy card-panel card-panel-strong">
            <div className="eyebrow">
              <SwatchBook size={16} />
              <span>视觉设计博客</span>
            </div>
            <h1>王道爵士 pengfeiwu@zju.edu.cn</h1>
            <p className="hero-summary">
              以简洁优雅的视觉语言，整理战国七雄人物角色原画。页面保留丰富动画、精致图标与分组浏览体验，让角色内容本身成为主视觉。
            </p>
            <div className="hero-tags">
              <span>视觉设计</span>
              <span>AI设计角色原画</span>            </div>
          </div>

          <div className="hero-meta card-panel">
            <div className="meta-block">
              <div className="eyebrow subtle">
                <Bot size={16} />
                <span>角色原画说明</span>
              </div>
              <p>
                所有人物图均以 636 × 900 竖幅 PNG 呈现，页面统一标注为“AI设计角色原画”，突出 AI 设计参与和后续人工视觉统筹。
              </p>
            </div>
          </div>
        </Reveal>
      </header>

      <main className="content-shell">
        <section className="metrics-grid">
          {INTRO_METRICS.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 90}>
              <article className="metric-card card-panel">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.note}</p>
              </article>
            </Reveal>
          ))}
        </section>

        <section className="section-block">
          <Reveal className="section-heading" delay={80}>
            <div>
              <div className="eyebrow subtle">
                <Sparkles size={16} />
                <span>精选陈列</span>
              </div>
              <h2>君王、文臣与武将的视觉切片</h2>
            </div>
            <p>
              用更克制的排版承载更丰富的色彩，让角色本身成为页面的主视觉，同时保留轻盈的动态反馈和高级感层次。
            </p>
          </Reveal>

          <div className="featured-grid">
            {featuredCharacters.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <article className="featured-card">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="featured-overlay" />
                  <div className="featured-copy">
                    <span>{item.stateLabel}</span>
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <Reveal className="section-heading" delay={100}>
            <div>
              <div className="eyebrow subtle">
                <GalleryVerticalEnd size={16} />
                <span>角色画廊</span>
              </div>
              <h2>战国七雄人物档案</h2>
            </div>
            <p>
              可以按国家筛选查看。人物介绍统一保持“王道爵士 pengfeiwu@zju.edu.cn”，职业身份仅展示为视觉设计。
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="filter-bar card-panel">
              {STATES.map((state) => (
                <button
                  key={state.key}
                  type="button"
                  className={state.key === activeState ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setActiveState(state.key)}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="gallery-grid">
            {galleryCharacters.map((item, index) => (
              <Reveal key={`${activeState}-${item.id}`} delay={(index % 12) * 35}>
                <article className="gallery-card">
                  <div className="gallery-image-wrap">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className="gallery-glow" aria-hidden="true" />
                  </div>
                  <div className="gallery-copy">
                    <div className="gallery-topline">
                      <span>{item.stateLabel}</span>
                      <span>{item.code}</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p>王道爵士 pengfeiwu@zju.edu.cn</p>
                    <div className="gallery-meta">
                      <span>
                        <Crown size={14} />
                        视觉设计
                      </span>
                      <span>
                        <Bot size={14} />
                        {item.note}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer card-panel">
        <div>
          <strong>王道爵士</strong>
          <p>视觉设计 / 角色原画档案</p>
        </div>
        <a href="mailto:pengfeiwu@zju.edu.cn">
          <Mail size={16} />
          pengfeiwu@zju.edu.cn
        </a>
      </footer>
    </div>
  );
}

export default App;

