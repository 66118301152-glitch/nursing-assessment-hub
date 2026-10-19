
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
    active: false
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

// ===== DIALOG CONTROL =====

function renderCurrentAssessment() {
  assessmentResult.innerHTML = "";

  if (currentTool === "gcs") renderGCS();
  if (currentTool === "7ps") render7Ps();
  if (currentTool === "apgar") renderAPGAR();
  if (currentTool === "bmi") renderBMI();
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

document.getElementById("calculateAssessment").addEventListener("click", () => {
  if (currentTool === "gcs") calculateGCS();
  if (currentTool === "7ps") calculate7Ps();
  if (currentTool === "apgar") calculateAPGAR();
  if (currentTool === "bmi") calculateBMI();
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
