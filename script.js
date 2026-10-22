
"use strict";

// ===== CATEGORIES =====

const categories = [
  { id: "neuro", icon: "🧠", name: "Neurological", th: "ระบบประสาท" },
  { id: "critical", icon: "🫀", name: "Critical Care", th: "ผู้ป่วยวิกฤต" },
  { id: "safety", icon: "🛡️", name: "Patient Safety", th: "ความปลอดภัยผู้ป่วย" },
  { id: "maternal", icon: "👶", name: "Maternal & Newborn", th: "มารดาและทารก" },
  { id: "geriatric", icon: "🧓", name: "Geriatric Care", th: "การพยาบาลผู้สูงอายุ" },
  { id: "general", icon: "⚕️", name: "General Health", th: "สุขภาพทั่วไป" }
];

const tools = [
  {
    id: "gcs", category: "neuro", icon: "🧠",
    name: "Glasgow Coma Scale",
    short: "GCS Assessment",
    description: "ประเมินระดับความรู้สึกตัวจากการลืมตา การตอบสนองทางคำพูด และการเคลื่อนไหว",
    active: true
  },
  {
    id: "7ps", category: "critical", icon: "🦵",
    name: "7Ps Assessment",
    short: "Compartment Syndrome",
    description: "ประเมินอาการและอาการแสดงที่เกี่ยวข้องกับภาวะ Compartment Syndrome",
    active: true
  },
  {
    id: "apgar", category: "maternal", icon: "👶",
    name: "APGAR Score",
    short: "Newborn Assessment",
    description: "ประเมินสภาพทารกแรกเกิดจากองค์ประกอบ 5 ด้าน",
    active: true
  },
  {
    id: "bmi", category: "general", icon: "⚖️",
    name: "BMI Calculator",
    short: "Body Mass Index",
    description: "คำนวณดัชนีมวลกายสำหรับผู้ใหญ่จากน้ำหนักและส่วนสูง",
    active: true
  },
  {
    id: "braden", category: "safety", icon: "🛏️",
    name: "Braden Scale", short: "Pressure Injury Risk",
    description: "ประเมินความเสี่ยงต่อการเกิดแผลกดทับ",
    active: false
  },
  {
    id: "morse", category: "safety", icon: "🚶",
    name: "Morse Fall Scale", short: "Fall Risk Assessment",
    description: "ประเมินความเสี่ยงต่อการพลัดตกหกล้ม",
    active: false
  },
  {
    id: "news2", category: "critical", icon: "📈",
    name: "NEWS2", short: "Early Warning Score",
    description: "เฝ้าระวังการเปลี่ยนแปลงของสัญญาณชีพ",
    active: true
  },
  {
    id: "latch", category: "maternal", icon: "🍼",
    name: "LATCH Score", short: "Breastfeeding Assessment",
    description: "ประเมินประสิทธิภาพการให้นมแม่",
    active: false
  },
  {
    id: "adl", category: "geriatric", icon: "🧓",
    name: "Barthel ADL", short: "Activities of Daily Living",
    description: "ประเมินความสามารถในการทำกิจวัตรประจำวัน",
    active: false
  },
  {
    id: "tugt", category: "geriatric", icon: "⏱️",
    name: "Timed Up and Go Test", short: "TUGT",
    description: "บันทึกผลการทดสอบการลุกขึ้นและเดิน",
    active: false
  }
];

// ===== DOM ELEMENTS =====

const categoryGrid = document.getElementById("categoryGrid");
const assessmentGrid = document.getElementById("assessmentGrid");
const filterButtons = document.getElementById("filterButtons");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

const dialog = document.getElementById("assessmentDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogSubtitle = document.getElementById("dialogSubtitle");
const assessmentContent = document.getElementById("assessmentContent");
const assessmentResult = document.getElementById("assessmentResult");

let activeCategory = "all";
let currentTool = null;

// ===== HOME PAGE =====

function renderCategories() {
  categoryGrid.innerHTML = categories.map(cat => {
    const count = tools.filter(t => t.category === cat.id).length;

    return `
      <button class="category-card" data-category="${cat.id}">
        <div class="category-icon">${cat.icon}</div>
        <h3>${cat.name}</h3>
        <p>${cat.th}</p>
        <div class="category-footer">
          <span>${count} assessment tools</span>
          <span>↗</span>
        </div>
      </button>
    `;
  }).join("");

  categoryGrid.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderTools();
      document.getElementById("assessments")
        .scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderFilters() {
  const filters = [
    { id: "all", name: "All Assessments" },
    ...categories.map(c => ({ id: c.id, name: c.name }))
  ];

  filterButtons.innerHTML = filters.map(f => `
    <button class="filter-btn ${activeCategory === f.id ? "active" : ""}"
      data-filter="${f.id}">
      ${f.name}
    </button>
  `).join("");

  filterButtons.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      renderFilters();
      renderTools();
    });
  });
}

function renderTools() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = tools.filter(tool => {
    const category = categories.find(c => c.id === tool.category);
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;

    const searchText = [
      tool.name, tool.short, tool.description,
      category?.name, category?.th
    ].join(" ").toLowerCase();

    return matchesCategory && searchText.includes(keyword);
  });

  resultCount.textContent = `${filtered.length} tools`;
  emptyState.hidden = filtered.length !== 0;

  assessmentGrid.innerHTML = filtered.map(tool => `
    <article class="tool-card">
      <div class="tool-top">
        <div class="tool-icon">${tool.icon}</div>
        <span class="tool-status ${tool.active ? "" : "soon"}">
          ${tool.active ? "AVAILABLE" : "COMING SOON"}
        </span>
      </div>
      <h3>${tool.name}</h3>
      <p class="tool-subtitle">${tool.short}</p>
      <p class="tool-description">${tool.description}</p>
      <button class="tool-button" data-tool="${tool.id}"
        ${tool.active ? "" : "disabled"}>
        ${tool.active ? "Start Assessment ↗" : "Coming Soon"}
      </button>
    </article>
  `).join("");

  assessmentGrid.querySelectorAll("button[data-tool]").forEach(button => {
    button.addEventListener("click", () => {
      openAssessment(button.dataset.tool);
    });
  });
}

searchInput.addEventListener("input", renderTools);

// ===== SHARED ASSESSMENT COMPONENTS =====

function selectQuestion(id, title, description, options, guide = []) {
  return `
    <div class="question">
      <h3>${title}</h3>
      <p>${description}</p>
      <select id="${id}" aria-label="${title}">
        <option value="">-- เลือกผลการประเมิน --</option>
        ${options.map(o =>
          `<option value="${o.value}">${o.label}</option>`
        ).join("")}
      </select>
      ${guide.length ? `
        <details>
          <summary>📖 วิธีประเมิน / Assessment Guide</summary>
          <ul>${guide.map(g => `<li>${g}</li>`).join("")}</ul>
        </details>
      ` : ""}
    </div>
  `;
}

function numberQuestion(id, title, description, placeholder) {
  return `
    <div class="question">
      <h3>${title}</h3>
      <p>${description}</p>
      <input id="${id}" type="number" min="0"
        step="any" placeholder="${placeholder}">
    </div>
  `;
}

function getValue(id) {
  return document.getElementById(id)?.value ?? "";
}

function requireAnswers(ids) {
  return ids.every(id => getValue(id) !== "");
}

function renderResult(title, score, description, warning = false, extra = "") {
  assessmentResult.innerHTML = `
    <div class="result-box ${warning ? "warning" : ""}">
      <h3>${title}</h3>
      <div class="score">${score}</div>
      <p>${description}</p>
      ${extra}
    </div>
  `;
  assessmentResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showIncomplete() {
  renderResult(
    "ข้อมูลยังไม่ครบ",
    "—",
    "กรุณาประเมินและเลือกคำตอบทุกข้อก่อนสรุปผล"
  );
}

// ===== GCS =====

const gcsQuestions = [
  {
    id: "eye", title: "Eye Opening (E)",
    description: "การตอบสนองด้านการลืมตา",
    options: [
      { value: 4, label: "E4 – ลืมตาได้เอง" },
      { value: 3, label: "E3 – ลืมตาเมื่อเรียก" },
      { value: 2, label: "E2 – ลืมตาเมื่อกระตุ้นด้วยความเจ็บปวด" },
      { value: 1, label: "E1 – ไม่ลืมตา" }
    ],
    guide: [
      "สังเกตว่าผู้ป่วยลืมตาเองหรือไม่",
      "หากไม่ลืมตา ให้เรียกผู้ป่วย",
      "หากยังไม่ตอบสนอง ให้ประเมินด้วยสิ่งกระตุ้นที่เหมาะสมตามแนวทางวิชาชีพ",
      "บันทึก NT (Not Testable) หากไม่สามารถประเมินได้ เช่น เปลือกตาบวมปิด"
    ]
  },
  {
    id: "verbal", title: "Verbal Response (V)",
    description: "การตอบสนองทางคำพูด",
    options: [
      { value: 5, label: "V5 – พูดคุยรู้เรื่องและรับรู้ถูกต้อง" },
      { value: 4, label: "V4 – สับสน แต่สามารถสนทนาได้" },
      { value: 3, label: "V3 – พูดเป็นคำ ไม่สัมพันธ์กับคำถาม" },
      { value: 2, label: "V2 – ส่งเสียงแต่ไม่เป็นคำ" },
      { value: 1, label: "V1 – ไม่ส่งเสียงตอบสนอง" }
    ],
    guide: [
      "สอบถามชื่อ สถานที่ และเวลา",
      "ประเมินความเหมาะสมของคำตอบ",
      "สังเกตการพูดเป็นคำหรือการส่งเสียง",
      "หากใส่ท่อช่วยหายใจหรือมีอุปสรรคอื่น ให้บันทึก NT พร้อมสาเหตุ ไม่ให้ V1 โดยอัตโนมัติ"
    ]
  },
  {
    id: "motor", title: "Motor Response (M)",
    description: "การตอบสนองด้านการเคลื่อนไหว",
    options: [
      { value: 6, label: "M6 – ทำตามคำสั่งได้" },
      { value: 5, label: "M5 – ระบุตำแหน่งสิ่งกระตุ้นเจ็บปวดได้" },
      { value: 4, label: "M4 – ชักแขนหรือขาหนีจากสิ่งกระตุ้น" },
      { value: 3, label: "M3 – งอแขนผิดปกติ" },
      { value: 2, label: "M2 – เหยียดแขนผิดปกติ" },
      { value: 1, label: "M1 – ไม่ตอบสนอง" }
    ],
    guide: [
      "เริ่มจากให้ผู้ป่วยทำตามคำสั่งง่าย ๆ",
      "หากไม่ทำตาม ให้ประเมินการตอบสนองต่อสิ่งกระตุ้นอย่างเหมาะสม",
      "แยกการระบุตำแหน่งเจ็บปวดออกจากการชักหนี",
      "ใช้การตอบสนองด้าน Motor ที่ดีที่สุด และพิจารณาข้อจำกัดจากการบาดเจ็บ"
    ]
  }
];

function renderGCS() {
  assessmentContent.innerHTML = `
    <p>ประเมินทั้ง 3 องค์ประกอบ แล้วบันทึกเป็น E, V, M
    ไม่ควรใช้เฉพาะคะแนนรวมโดยไม่ระบุรายละเอียด</p>
    ${gcsQuestions.map(q =>
      selectQuestion(q.id, q.title, q.description, q.options, q.guide)
    ).join("")}
    <p class="disclaimer">
      หากองค์ประกอบใดไม่สามารถประเมินได้ ห้ามแทนด้วย 1
      และไม่ควรคำนวณคะแนนรวม
    </p>
  `;
}

function calculateGCS() {
  if (!requireAnswers(["eye", "verbal", "motor"])) {
    showIncomplete();
    return;
  }

  const e = Number(getValue("eye"));
  const v = Number(getValue("verbal"));
  const m = Number(getValue("motor"));
  const total = e + v + m;

  const warning = total <= 8;

  renderResult(
    "Glasgow Coma Scale",
    `${total} / 15`,
    `ผลการประเมิน E${e} V${v} M${m} — ${
      total <= 8 ? "ระดับความรู้สึกตัวบกพร่องรุนแรง" :
      total <= 12 ? "ระดับความรู้สึกตัวบกพร่องปานกลาง" :
      "ระดับความรู้สึกตัวบกพร่องเล็กน้อยหรืออยู่ในช่วงคะแนนสูง"
    }`,
    warning,
    "<p>คะแนนต้องพิจารณาร่วมกับสภาพผู้ป่วย แนวโน้มการเปลี่ยนแปลง และการประเมินทางระบบประสาทอื่น ๆ</p>"
  );
}

// ===== 7Ps =====

const sevenPs = [
  {
    id: "pain", name: "Pain — อาการปวด",
    description: "อาการปวดรุนแรงผิดสัดส่วนกับการบาดเจ็บ",
    guide: [
      "สอบถามความปวด ตำแหน่ง ลักษณะ และการเปลี่ยนแปลง",
      "ประเมินอาการปวดขณะยืดกล้ามเนื้อแบบ Passive stretch อย่างระมัดระวัง",
      "เปรียบเทียบความปวดกับลักษณะการบาดเจ็บและการรักษาที่ได้รับ"
    ]
  },
  {
    id: "pallor", name: "Pallor — ผิวหนังซีด",
    description: "สีผิวส่วนปลายซีดผิดปกติ",
    guide: [
      "สังเกตสีผิวบริเวณปลายนิ้วมือหรือนิ้วเท้า",
      "เปรียบเทียบกับอวัยวะข้างตรงข้าม",
      "ประเมินการไหลเวียนเลือดส่วนปลายร่วมด้วย"
    ]
  },
  {
    id: "paresthesia", name: "Paresthesia — อาการชา",
    description: "มีอาการชา เสียวซ่า หรือรับความรู้สึกลดลง",
    guide: [
      "สอบถามอาการชาหรือเสียวซ่า",
      "ทดสอบการรับสัมผัสเบา ๆ ตามตำแหน่งเส้นประสาท",
      "เปรียบเทียบกับข้างปกติ"
    ]
  },
  {
    id: "paralysis", name: "Paralysis — การเคลื่อนไหวผิดปกติ",
    description: "กล้ามเนื้ออ่อนแรงหรือเคลื่อนไหวไม่ได้",
    guide: [
      "ให้ผู้ป่วยขยับนิ้วหรือข้อที่เกี่ยวข้อง",
      "ประเมินกำลังกล้ามเนื้อ",
      "ตรวจสอบข้อจำกัดจากการบาดเจ็บหรืออุปกรณ์ดาม"
    ]
  },
  {
    id: "pulselessness", name: "Pulselessness — ชีพจรส่วนปลาย",
    description: "ชีพจรส่วนปลายอ่อนลงหรือคลำไม่ได้",
    guide: [
      "คลำชีพจรส่วนปลาย เช่น Radial, Dorsalis pedis หรือ Posterior tibial",
      "เปรียบเทียบทั้งสองข้าง",
      "ชีพจรที่ยังคลำได้ไม่สามารถตัด Compartment Syndrome ออกได้"
    ]
  },
  {
    id: "temperature", name: "Poikilothermia — อุณหภูมิผิวหนัง",
    description: "ปลายอวัยวะเย็นกว่าปกติ",
    guide: [
      "สัมผัสอุณหภูมิผิวหนัง",
      "เปรียบเทียบกับอวัยวะข้างตรงข้าม",
      "พิจารณาสีผิวและการไหลเวียนส่วนปลายร่วมกัน"
    ]
  },
  {
    id: "pressure", name: "Pressure — กล้ามเนื้อบวมตึง",
    description: "ช่องกล้ามเนื้อบวม แข็ง หรือตึงผิดปกติ",
    guide: [
      "สังเกตอาการบวมและความตึงของกล้ามเนื้อ",
      "คลำอย่างนุ่มนวลเพื่อประเมินความแน่น",
      "การวัดความดันในช่องกล้ามเนื้อเป็นการตรวจโดยบุคลากรที่ได้รับมอบหมายตามข้อบ่งชี้"
    ]
  }
];

function render7Ps() {
  const options = [
    { value: "normal", label: "ไม่พบอาการผิดปกติจากการประเมิน" },
    { value: "abnormal", label: "พบความผิดปกติ" },
    { value: "unknown", label: "ไม่สามารถประเมินได้" }
  ];

  assessmentContent.innerHTML = `
    <p class="disclaimer">
      Acute Compartment Syndrome เป็นภาวะฉุกเฉิน
      หากสงสัยจากอาการปวดผิดปกติหรืออาการทางระบบประสาท
      ต้องรีบรายงานแพทย์ ไม่ต้องรอให้ครบ 7Ps
    </p>
    ${sevenPs.map(p =>
      selectQuestion(p.id, p.name, p.description, options, p.guide)
    ).join("")}
  `;
}

function calculate7Ps() {
  const ids = sevenPs.map(p => p.id);

  if (!requireAnswers(ids)) {
    showIncomplete();
    return;
  }

  const abnormal = sevenPs.filter(p =>
    getValue(p.id) === "abnormal"
  );

  const unknown = sevenPs.filter(p =>
    getValue(p.id) === "unknown"
  );

  const names = abnormal.map(p => p.name);

  if (abnormal.length > 0) {
    renderResult(
      "พบความผิดปกติจากการประเมิน 7Ps",
      `${abnormal.length} รายการ`,
      "พบสัญญาณที่ต้องประเมินเพิ่มเติมโดยทันที หากสงสัย Acute Compartment Syndrome ให้รีบรายงานแพทย์ตามแนวทางหน่วยงาน",
      true,
      `<ul>${names.map(n => `<li>${n}</li>`).join("")}</ul>
       <p>จำนวนรายการผิดปกติไม่ใช่คะแนนวินิจฉัยหรือระดับความรุนแรงของโรค</p>`
    );
  } else if (unknown.length > 0) {
    renderResult(
      "การประเมินยังไม่สมบูรณ์",
      "—",
      `มี ${unknown.length} รายการที่ไม่สามารถประเมินได้ ต้องใช้ข้อมูลทางคลินิกเพิ่มเติม ไม่สามารถยืนยันว่าปลอดภัย`
    );
  } else {
    renderResult(
      "สรุปการประเมิน 7Ps",
      "0 รายการ",
      "ไม่พบความผิดปกติในรายการที่เลือกขณะนี้ แต่ไม่สามารถตัดภาวะ Compartment Syndrome ออกได้ ควรติดตามอาการและประเมินซ้ำตามความเสี่ยง"
    );
  }
}

// ===== APGAR =====


const apgarQuestions = [
  {
    id: "appearance",
    title: "Appearance — สีผิว",
    options: [
      { value: 0, label: "0 — ซีดหรือเขียวทั่วตัว" },
      { value: 1, label: "1 — ลำตัวชมพู ปลายมือปลายเท้าเขียว" },
      { value: 2, label: "2 — สีผิวชมพูทั่วตัว" }
    ],
    guide: [
      "สังเกตสีผิวบริเวณลำตัวและปลายมือปลายเท้า",
      "พิจารณาข้อจำกัดของการประเมินสีผิวร่วมด้วย"
    ]
  },
  {
    id: "pulse",
    title: "Pulse — อัตราการเต้นหัวใจ",
    options: [
      { value: 0, label: "0 — ไม่มีการเต้นของหัวใจ" },
      { value: 1, label: "1 — หัวใจเต้นน้อยกว่า 100 ครั้ง/นาที" },
      { value: 2, label: "2 — หัวใจเต้นตั้งแต่ 100 ครั้ง/นาทีขึ้นไป" }
    ],
    guide: [
      "ประเมินอัตราการเต้นหัวใจด้วยวิธีที่เหมาะสมตามแนวทางการดูแลทารกแรกเกิด"
    ]
  },
  {
    id: "grimace",
    title: "Grimace — การตอบสนองต่อสิ่งกระตุ้น",
    options: [
      { value: 0, label: "0 — ไม่ตอบสนอง" },
      { value: 1, label: "1 — แสดงสีหน้าหรือขยับเล็กน้อย" },
      { value: 2, label: "2 — ร้อง ไอ หรือจามเมื่อกระตุ้น" }
    ],
    guide: [
      "สังเกตปฏิกิริยาตอบสนองต่อการกระตุ้นที่เหมาะสม"
    ]
  },
  {
    id: "activity",
    title: "Activity — ความตึงตัวของกล้ามเนื้อ",
    options: [
      { value: 0, label: "0 — กล้ามเนื้ออ่อนปวกเปียก" },
      { value: 1, label: "1 — งอแขนขาบางส่วน" },
      { value: 2, label: "2 — เคลื่อนไหวแข็งแรง" }
    ],
    guide: [
      "สังเกตความตึงตัวของกล้ามเนื้อและการเคลื่อนไหวของแขนขา"
    ]
  },
  {
    id: "respiration",
    title: "Respiration — การหายใจ",
    options: [
      { value: 0, label: "0 — ไม่หายใจ" },
      { value: 1, label: "1 — หายใจช้าหรือไม่สม่ำเสมอ ร้องเบา" },
      { value: 2, label: "2 — หายใจดี ร้องเสียงดัง" }
    ],
    guide: [
      "สังเกตการหายใจ ความสม่ำเสมอ และการร้องของทารก"
    ]
  }
];

function renderAPGAR() {
  assessmentContent.innerHTML = `
    <div class="question">
      <h3>ช่วงเวลาที่ประเมิน (Assessment Time)</h3>
      <p>เลือกเวลาหลังคลอดที่ทำการประเมิน APGAR Score</p>
      <select id="apgarTime">
        <option value="1">1 นาทีหลังคลอด</option>
        <option value="5">5 นาทีหลังคลอด</option>
        <option value="10">10 นาทีหลังคลอด</option>
        <option value="15">15 นาทีหลังคลอด</option>
        <option value="20">20 นาทีหลังคลอด</option>
      </select>
    </div>

    ${apgarQuestions.map(q =>
      selectQuestion(
        q.id,
        q.title,
        "เลือกผลการประเมินที่ตรงกับสภาพทารก",
        q.options,
        q.guide
      )
    ).join("")}

    <p class="disclaimer">
      <strong>ข้อควรระวัง:</strong>
      APGAR Score เป็นเครื่องมือประเมินและบันทึกสภาพ
      ทารกแรกเกิด ไม่สามารถใช้คะแนนเพียงอย่างเดียว
      เพื่อวินิจฉัย Birth Asphyxia ได้
      และไม่ควรชะลอการช่วยกู้ชีพเพื่อรอผล APGAR
    </p>
  `;
}

function calculateAPGAR() {
  const ids = apgarQuestions.map(q => q.id);

  if (!requireAnswers(ids)) {
    showIncomplete();
    return;
  }

  const total = ids.reduce(
    (sum, id) => sum + Number(getValue(id)), 0
  );

  const time = Number(getValue("apgarTime"));

  let interpretation = "";
  let explanation = "";
  let color = "";
  let background = "";
  let recommendation = "";

  if (total >= 7) {
    interpretation = "Reassuring";
    explanation = "คะแนนอยู่ในช่วงน่าพอใจ (7–10 คะแนน)";
    color = "#15803d";
    background = "#edf9f0";

    recommendation =
      "ติดตามการหายใจ อัตราการเต้นของหัวใจ " +
      "อุณหภูมิ และสภาพทั่วไปของทารกตามแนวทางหน่วยงาน";

  } else if (total >= 4) {
    interpretation = "Moderately Abnormal";
    explanation = "คะแนนผิดปกติระดับปานกลาง (4–6 คะแนน)";
    color = "#b76a07";
    background = "#fff5e6";

    recommendation =
      "ประเมินสภาพทารกอย่างใกล้ชิด " +
      "โดยเฉพาะการหายใจและอัตราการเต้นของหัวใจ " +
      "และดำเนินการช่วยเหลือตามแนวทางการกู้ชีพทารกแรกเกิด";

  } else {
    interpretation = "Low APGAR Score";
    explanation = "คะแนนต่ำผิดปกติรุนแรง (0–3 คะแนน)";
    color = "#c52f35";
    background = "#fff0f0";

    recommendation =
      "ทารกมีคะแนนต่ำมาก ต้องประเมินและช่วยเหลือ " +
      "ตามแนวทางการกู้ชีพทารกแรกเกิดทันที " +
      "โดยไม่รอผล APGAR เพื่อเริ่มการช่วยเหลือ";
  }

  const followUp =
    time >= 5 && total < 7
      ? "คะแนนต่ำกว่า 7 ที่นาทีที่ 5 หรือหลังจากนั้น " +
        "ควรประเมิน APGAR ซ้ำทุก 5 นาที จนถึง 20 นาทีหลังคลอด"
      : time === 1
      ? "ควรบันทึก APGAR อีกครั้งเมื่อครบ 5 นาทีหลังคลอด"
      : "ติดตามอาการและบันทึกการประเมินตามข้อบ่งชี้";

  assessmentResult.innerHTML = `
    <div class="apgar-result-card"
         style="--apgar-color:${color};
                --apgar-bg:${background}">

      <div class="apgar-result-heading">
        APGAR SCORE INTERPRETATION
      </div>

      <div class="apgar-score-display">
        ${total}<span> / 10</span>
      </div>

      <div class="apgar-result-title">
        ${interpretation}
      </div>

      <p><strong>${explanation}</strong></p>

      <div class="apgar-result-detail">
        <p><strong>เวลาที่ประเมิน:</strong> ${time} นาทีหลังคลอด</p>

        <p><strong>แนวทางการดูแล:</strong><br>
          ${recommendation}
        </p>

        <p><strong>การติดตาม:</strong><br>
          ${followUp}
        </p>
      </div>

      <div class="apgar-caution">
        <strong>Birth Asphyxia — Clinical Consideration</strong>
        <p>
          APGAR Score ต่ำอาจพบร่วมกับภาวะ Birth Asphyxia
          แต่ไม่สามารถวินิจฉัยภาวะดังกล่าว
          หรือระบุความรุนแรงได้จากคะแนนเพียงอย่างเดียว
          ต้องพิจารณาข้อมูลทางคลินิกและการตรวจเพิ่มเติม
          เช่น Umbilical arterial blood gas ตามข้อบ่งชี้
        </p>
      </div>

    </div>
  `;

  assessmentResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

// ===== BMI =====

function renderBMI() {
  assessmentContent.innerHTML = `
    <p>คำนวณดัชนีมวลกายสำหรับผู้ใหญ่
    โดยใช้สูตร น้ำหนัก (kg) / ส่วนสูง (m)²</p>
    ${numberQuestion("weight","Weight — น้ำหนัก","ระบุน้ำหนักเป็นกิโลกรัม","เช่น 55")}
    ${numberQuestion("height","Height — ส่วนสูง","ระบุส่วนสูงเป็นเซนติเมตร","เช่น 160")}
    <p class="disclaimer">
      การแปลผลใช้เกณฑ์ผู้ใหญ่ทั่วไปสำหรับประชากรเอเชีย
      ไม่เหมาะสำหรับเด็ก หญิงตั้งครรภ์ หรือการประเมินภาวะโภชนาการจาก BMI เพียงค่าเดียว
    </p>
  `;
}

function calculateBMI() {
  const weight = Number(getValue("weight"));
  const height = Number(getValue("height"));

  if (!Number.isFinite(weight) || !Number.isFinite(height) ||
      weight <= 0 || height <= 0) {
    renderResult(
      "ข้อมูลไม่ถูกต้อง","—",
      "กรุณากรอกน้ำหนักและส่วนสูงเป็นตัวเลขมากกว่า 0"
    );
    return;
  }

  const bmi = weight / Math.pow(height / 100,2);

  if (!Number.isFinite(bmi) || bmi > 150) {
    renderResult("ข้อมูลไม่ถูกต้อง","—","กรุณาตรวจสอบหน่วยและค่าที่กรอก");
    return;
  }

  let category = "";

  if (bmi < 18.5) category = "น้ำหนักน้อย";
  else if (bmi < 23) category = "อยู่ในเกณฑ์ปกติ";
  else if (bmi < 25) category = "น้ำหนักเกิน";
  else if (bmi < 30) category = "อ้วนระดับ 1";
  else category = "อ้วนระดับ 2";

  renderResult(
    "Body Mass Index",
    bmi.toFixed(2),
    `ผลการแปลเบื้องต้น: ${category}`,
    bmi < 18.5 || bmi >= 23,
    "<p>BMI เป็นเพียงตัวชี้วัดเบื้องต้น ต้องประเมินสุขภาพและองค์ประกอบร่างกายร่วมด้วย</p>"
  );
}

// =============================================
// NEWS2 - National Early Warning Score 2
// =============================================

// 1. Assessment form
function renderNEWS2() {
  assessmentContent.innerHTML = `
    <div class="news2-intro">
      <strong>National Early Warning Score 2</strong>
      <p>
        เครื่องมือประเมินความเสี่ยงต่อการทรุดลงของผู้ป่วย
        จากสัญญาณชีพและระดับความรู้สึกตัว
      </p>
      <p>
        ใช้สำหรับผู้ป่วยอายุตั้งแต่ 16 ปีขึ้นไป
        ในบริบททางคลินิกที่เหมาะสม
        ไม่ใช้สำหรับหญิงตั้งครรภ์หรือเด็ก
      </p>
    </div>

    <div class="question">
      <h3>1. Respiratory Rate (RR)</h3>
      <p>อัตราการหายใจ (ครั้ง/นาที)</p>
      <input
        type="number"
        id="newsRR"
        min="1"
        max="100"
        step="1"
        placeholder="เช่น 18"
      >
      <details>
        <summary>📖 วิธีประเมิน Respiratory Rate</summary>
        <ul>
          <li>จัดให้ผู้ป่วยอยู่ในท่าที่เหมาะสม</li>
          <li>สังเกตการเคลื่อนไหวของทรวงอกหรือหน้าท้อง</li>
          <li>นับการหายใจเข้าและออกเป็น 1 ครั้ง</li>
          <li>นับให้ครบ 1 นาที</li>
          <li>สังเกตความลึก จังหวะ และการใช้กล้ามเนื้อช่วยหายใจ</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>2. Oxygen Saturation (SpO₂)</h3>
      <p>ความอิ่มตัวของออกซิเจนในเลือด (%)</p>
      <input
        type="number"
        id="newsSpO2"
        min="0"
        max="100"
        step="1"
        placeholder="เช่น 98"
      >
      <details>
        <summary>📖 วิธีประเมิน SpO₂</summary>
        <ul>
          <li>ใช้เครื่อง Pulse Oximeter ที่เหมาะสม</li>
          <li>ตรวจสอบตำแหน่ง Probe และคุณภาพของสัญญาณ</li>
          <li>รอให้ค่าคงที่ก่อนบันทึกผล</li>
          <li>พิจารณาการไหลเวียนเลือดส่วนปลาย การเคลื่อนไหว และปัจจัยที่รบกวนการวัด</li>
          <li>ประเมินอาการของผู้ป่วยร่วมกับค่าที่วัดได้</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>3. SpO₂ Scale</h3>
      <p>เลือกเกณฑ์ SpO₂ ที่เหมาะสมกับผู้ป่วย</p>
      <select id="newsScale">
        <option value="1">Scale 1 — ผู้ป่วยทั่วไป</option>
        <option value="2">Scale 2 — เป้าหมาย SpO₂ 88–92% ที่ได้รับการกำหนดโดยผู้มีคุณสมบัติเหมาะสม</option>
      </select>
      <details>
        <summary>📖 วิธีเลือก SpO₂ Scale</summary>
        <ul>
          <li>Scale 1: ใช้กับผู้ป่วยส่วนใหญ่</li>
          <li>Scale 2: ใช้เมื่อมีภาวะ Hypercapnic Respiratory Failure ที่ยืนยันแล้ว และมีคำสั่งใช้เป้าหมาย SpO₂ 88–92%</li>
          <li>ห้ามเลือก Scale 2 จากการเป็น COPD เพียงอย่างเดียว</li>
          <li>หากไม่แน่ใจ ต้องตรวจสอบแผนการรักษาก่อน</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>4. Supplemental Oxygen</h3>
      <p>ผู้ป่วยกำลังได้รับออกซิเจนเสริมหรือไม่</p>
      <select id="newsOxygen">
        <option value="">-- เลือก --</option>
        <option value="air">Room Air — ไม่ได้รับออกซิเจนเสริม</option>
        <option value="oxygen">Supplemental Oxygen — ได้รับออกซิเจนเสริม</option>
      </select>
      <details>
        <summary>📖 วิธีประเมิน Oxygen Supplementation</summary>
        <ul>
          <li>ตรวจสอบว่าผู้ป่วยหายใจด้วย Room Air หรือได้รับออกซิเจนเสริม</li>
          <li>Supplemental Oxygen ให้ 2 คะแนน</li>
          <li>Room Air ให้ 0 คะแนน</li>
          <li>หากได้รับออกซิเจน ให้บันทึกอุปกรณ์และอัตราการไหลในเวชระเบียนตามแนวทางหน่วยงาน</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>5. Systolic Blood Pressure (SBP)</h3>
      <p>ความดันโลหิตตัวบน (mmHg)</p>
      <input
        type="number"
        id="newsSBP"
        min="1"
        max="350"
        step="1"
        placeholder="เช่น 120"
      >
      <details>
        <summary>📖 วิธีประเมิน Blood Pressure</summary>
        <ul>
          <li>ให้ผู้ป่วยอยู่ในท่าที่เหมาะสม</li>
          <li>เลือกขนาดผ้าพันแขนที่เหมาะสม</li>
          <li>วัดความดันโลหิตด้วยเครื่องมือที่ได้มาตรฐาน</li>
          <li>NEWS2 ใช้ค่าความดันตัวบน (Systolic BP)</li>
          <li>หากค่าผิดปกติ ให้ตรวจสอบความถูกต้องและประเมินอาการร่วมด้วย</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>6. Pulse Rate (PR)</h3>
      <p>อัตราการเต้นของหัวใจ (ครั้ง/นาที)</p>
      <input
        type="number"
        id="newsPulse"
        min="1"
        max="250"
        step="1"
        placeholder="เช่น 80"
      >
      <details>
        <summary>📖 วิธีประเมิน Pulse Rate</summary>
        <ul>
          <li>คลำชีพจร Radial หรือประเมินด้วยเครื่องมือที่เหมาะสม</li>
          <li>นับชีพจรเต็ม 1 นาที โดยเฉพาะเมื่อจังหวะไม่สม่ำเสมอ</li>
          <li>ประเมินอัตรา จังหวะ และความแรงของชีพจร</li>
          <li>บันทึกค่าที่วัดได้เป็นครั้ง/นาที</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>7. Body Temperature</h3>
      <p>อุณหภูมิร่างกาย (°C)</p>
      <input
        type="number"
        id="newsTemp"
        min="25"
        max="45"
        step="0.1"
        placeholder="เช่น 37.0"
      >
      <details>
        <summary>📖 วิธีประเมิน Temperature</summary>
        <ul>
          <li>วัดอุณหภูมิด้วยเครื่องมือที่เหมาะสม</li>
          <li>ใช้ตำแหน่งวัดตามแนวทางของหน่วยงาน</li>
          <li>ตรวจสอบหน่วยว่าเป็นองศาเซลเซียส</li>
          <li>บันทึกผลอย่างน้อย 1 ตำแหน่งทศนิยม</li>
        </ul>
      </details>
    </div>

    <div class="question">
      <h3>8. Level of Consciousness (ACVPU)</h3>
      <p>ระดับความรู้สึกตัวและอาการสับสนที่เกิดขึ้นใหม่</p>
      <select id="newsConsciousness">
        <option value="">-- เลือก --</option>
        <option value="0">A — Alert (รู้สึกตัวดี ไม่มีสับสนใหม่)</option>
        <option value="3">C — New Confusion (สับสนเกิดขึ้นใหม่)</option>
        <option value="3">V — Response to Voice</option>
        <option value="3">P — Response to Pain</option>
        <option value="3">U — Unresponsive</option>
      </select>
      <details>
        <summary>📖 วิธีประเมิน ACVPU</summary>
        <ul>
          <li>A: ผู้ป่วยตื่นและตอบสนองเหมาะสม ไม่มีภาวะสับสนที่เกิดขึ้นใหม่</li>
          <li>C: มีอาการสับสนเกิดขึ้นใหม่เมื่อเทียบกับสภาพเดิม</li>
          <li>V: ตอบสนองเมื่อเรียกด้วยเสียง</li>
          <li>P: ตอบสนองต่อการกระตุ้นด้วยความเจ็บปวดที่เหมาะสม</li>
          <li>U: ไม่ตอบสนอง</li>
        </ul>
      </details>
    </div>

    <p class="disclaimer">
      NEWS2 เป็นเครื่องมือช่วยเฝ้าระวัง ไม่ใช่เครื่องมือวินิจฉัย
      หากผู้ป่วยมีอาการทรุดลง ต้องประเมินและตอบสนองทันที
      โดยไม่รอคะแนน NEWS2
    </p>
  `;
}

// =============================================
// 2. NEWS2 Scoring Functions
// =============================================

function newsRRScore(x) {
  if (x <= 8) return 3;
  if (x <= 11) return 1;
  if (x <= 20) return 0;
  if (x <= 24) return 2;
  return 3;
}

function newsSpO2Score(x, scale, oxygen) {
  if (scale === 1) {
    if (x <= 91) return 3;
    if (x <= 93) return 2;
    if (x <= 95) return 1;
    return 0;
  }

  // Scale 2
  if (x <= 83) return 3;
  if (x <= 85) return 2;
  if (x <= 87) return 1;
  if (x <= 92) return 0;

  // Above 92%: differs on air vs oxygen
  if (!oxygen) return 0;

  if (x <= 94) return 1;
  if (x <= 96) return 2;
  return 3;
}

function newsSBPScore(x) {
  if (x <= 90) return 3;
  if (x <= 100) return 2;
  if (x <= 110) return 1;
  if (x <= 219) return 0;
  return 3;
}

function newsPulseScore(x) {
  if (x <= 40) return 3;
  if (x <= 50) return 1;
  if (x <= 90) return 0;
  if (x <= 110) return 1;
  if (x <= 130) return 2;
  return 3;
}

function newsTempScore(x) {
  if (x <= 35.0) return 3;
  if (x < 36.1) return 1;
  if (x < 38.1) return 0;
  if (x < 39.1) return 1;
  return 2;
}

// =============================================
// 3. Validate and Calculate NEWS2
// =============================================

function calculateNEWS2() {
  const ids = [
    "newsRR",
    "newsSpO2",
    "newsScale",
    "newsOxygen",
    "newsSBP",
    "newsPulse",
    "newsTemp",
    "newsConsciousness"
  ];

  if (!requireAnswers(ids)) {
    showIncomplete();
    return;
  }

  const rr = Number(getValue("newsRR"));
  const spo2 = Number(getValue("newsSpO2"));
  const scale = Number(getValue("newsScale"));
  const oxygen = getValue("newsOxygen") === "oxygen";
  const sbp = Number(getValue("newsSBP"));
  const pulse = Number(getValue("newsPulse"));
  const temp = Number(getValue("newsTemp"));
  const consciousness = Number(getValue("newsConsciousness"));

  // Validate measurements before scoring
  const validInteger = (x, min, max) =>
    Number.isInteger(x) && x >= min && x <= max;

  const valid =
    validInteger(rr, 1, 100) &&
    validInteger(spo2, 0, 100) &&
    validInteger(sbp, 1, 350) &&
    validInteger(pulse, 1, 250) &&
    Number.isFinite(temp) &&
    temp >= 25 && temp <= 45 &&
    [1, 2].includes(scale) &&
    [0, 3].includes(consciousness);

  if (!valid) {
    renderResult(
      "ข้อมูลไม่ถูกต้อง",
      "—",
      "กรุณาตรวจสอบตัวเลขและหน่วยการวัดให้ถูกต้องทุกช่อง"
    );
    return;
  }

  const components = [
    {
      name: "Respiratory Rate",
      value: `${rr} /min`,
      score: newsRRScore(rr)
    },
    {
      name: `SpO₂ (Scale ${scale})`,
      value: `${spo2}%`,
      score: newsSpO2Score(spo2, scale, oxygen)
    },
    {
      name: "Supplemental Oxygen",
      value: oxygen ? "Yes" : "No",
      score: oxygen ? 2 : 0
    },
    {
      name: "Systolic BP",
      value: `${sbp} mmHg`,
      score: newsSBPScore(sbp)
    },
    {
      name: "Pulse Rate",
      value: `${pulse} /min`,
      score: newsPulseScore(pulse)
    },
    {
      name: "Temperature",
      value: `${temp.toFixed(1)} °C`,
      score: newsTempScore(temp)
    },
    {
      name: "ACVPU",
      value: consciousness === 0 ? "Alert" : "Abnormal",
      score: consciousness
    }
  ];

  const total = components.reduce(
    (sum, item) => sum + item.score, 0
  );

  const singleThree = components.some(
    item => item.score === 3
  );

  let risk = "";
  let advice = "";
  let riskClass = "";

  if (total >= 7) {
    risk = "HIGH CLINICAL RISK";
    riskClass = "news-high";
    advice =
      "ความเสี่ยงสูง ควรได้รับการประเมินและตอบสนองฉุกเฉิน " +
      "โดยทีมที่มีสมรรถนะในการดูแลผู้ป่วยวิกฤตตามระบบของหน่วยงาน";
  } else if (total >= 5) {
    risk = "MEDIUM CLINICAL RISK";
    riskClass = "news-medium";
    advice =
      "ความเสี่ยงปานกลาง ต้องประเมินอย่างเร่งด่วน " +
      "เพิ่มการเฝ้าระวังและรายงานผู้รับผิดชอบตามแนวทางหน่วยงาน";
  } else if (singleThree) {
    risk = "LOW–MEDIUM RISK (SINGLE 3)";
    riskClass = "news-medium";
    advice =
      "มีตัวแปรอย่างน้อยหนึ่งรายการได้ 3 คะแนน " +
      "ควรได้รับการประเมินอย่างเร่งด่วนตามเกณฑ์ Single Parameter Trigger";
  } else {
    risk = "LOW CLINICAL RISK";
    riskClass = "news-low";
    advice =
      "ความเสี่ยงต่ำตาม NEWS2 ในขณะประเมิน " +
      "แต่ยังต้องติดตามอาการและสัญญาณชีพตามแผนการดูแล";
  }

  const rows = components.map(item => `
    <div class="news-score-row">
      <span>${item.name}<small> ${item.value}</small></span>
      <strong>${item.score}</strong>
    </div>
  `).join("");

  const redParameters = components
    .filter(item => item.score === 3)
    .map(item => item.name);

  assessmentResult.innerHTML = `
    <div class="news-result ${riskClass}">
      <div class="news-result-heading">
        NATIONAL EARLY WARNING SCORE 2
      </div>

      <div class="news-total-score">${total}</div>

      <h3>${risk}</h3>

      <p>${advice}</p>

      <div class="news-score-details">
        <strong>Individual Parameter Scores</strong>
        ${rows}
      </div>

      ${singleThree ? `
        <div class="news-alert">
          ⚠ Single Parameter Trigger:
          ${redParameters.join(", ")}
        </div>
      ` : ""}

      <div class="news-safety-note">
        <strong>Clinical Safety Notice</strong>
        <p>
          หากผู้ป่วยมีอาการทรุดลง หรือบุคลากรมีความกังวล
          ให้ประเมินและรายงานทันที ไม่ว่าคะแนน NEWS2 จะเป็นเท่าใด
          NEWS2 ไม่สามารถใช้แทนดุลยพินิจทางคลินิก
          หรือแนวทางการตอบสนองของสถานพยาบาลได้
        </p>
      </div>
    </div>
  `;

  assessmentResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

// ===== DIALOG CONTROL =====

function renderCurrentAssessment() {
  assessmentResult.innerHTML = "";

  if (currentTool === "gcs") renderGCS();
  if (currentTool === "7ps") render7Ps();
  if (currentTool === "apgar") renderAPGAR();
  if (currentTool === "bmi") renderBMI();
  if (currentTool === "news2") renderNEWS2();
}

function openAssessment(id) {
  const tool = tools.find(t => t.id === id && t.active);
  if (!tool) return;

  currentTool = id;
  dialogTitle.textContent = tool.name;
  dialogSubtitle.textContent = tool.description;

  renderCurrentAssessment();
  dialog.showModal();
}

document.getElementById("closeDialog").addEventListener("click", () => {
  dialog.close();
});

document.getElementById("resetAssessment").addEventListener("click", () => {
  renderCurrentAssessment();
});


document.getElementById("calculateAssessment")
  .addEventListener("click", () => {
    if (currentTool === "gcs") calculateGCS();
    if (currentTool === "7ps") calculate7Ps();
    if (currentTool === "apgar") calculateAPGAR();
    if (currentTool === "bmi") calculateBMI();
    if (currentTool === "news2") calculateNEWS2();
  });


dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("close", () => {
  currentTool = null;
  assessmentContent.replaceChildren();
  assessmentResult.replaceChildren();
});

// ===== INITIALIZE =====

renderCategories();
renderFilters();
renderTools();
