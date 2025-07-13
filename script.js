
const semesters = [
    {
        name: "Semestre 1",
        subjects: [
            { name: "Vocación y Sentido Médico I", id: "vsm1" },
            { name: "Biología Celular", id: "bio1" },
            { name: "Química General", id: "quim1" }
        ]
    },
    {
        name: "Semestre 2",
        subjects: [
            { name: "Humanidades Médicas I", id: "hum1", prereq: "vsm1" },
            { name: "Anatomía I", id: "anat1", prereq: "bio1" },
            { name: "Química Orgánica", id: "quim2", prereq: "quim1" }
        ]
    },
    {
        name: "Semestre 3",
        subjects: [
            { name: "Vocación y Sentido Médico II", id: "vsm2", prereq: "vsm1" },
            { name: "Anatomía II", id: "anat2", prereq: "anat1" },
            { name: "Electiva I", id: "elec1" }
        ]
    },
    {
        name: "Semestre 4",
        subjects: [
            { name: "Humanidades Médicas II", id: "hum2", prereq: "hum1" },
            { name: "Fisiología I", id: "fisiol1", prereq: "anat2" },
            { name: "Electiva II", id: "elec2", prereq: "elec1" }
        ]
    },
    {
        name: "Semestre 5",
        subjects: [
            { name: "Fisiología II", id: "fisiol2", prereq: "fisiol1" },
            { name: "Farmacología I", id: "farm1", prereq: "fisiol1" }
        ]
    },
    {
        name: "Semestre 6",
        subjects: [
            { name: "Farmacología II", id: "farm2", prereq: "farm1" },
            { name: "Electiva III", id: "elec3", prereq: "elec2" }
        ]
    }
];

const completed = new Set(JSON.parse(localStorage.getItem("completedSubjects") || "[]"));

function isUnlocked(subject) {
    return !subject.prereq || completed.has(subject.prereq);
}

function render() {
    const container = document.getElementById("carousel");
    container.innerHTML = "";
    let unlockedUntil = 0;

    for (let i = 0; i < semesters.length; i++) {
        const semester = semesters[i];
        const semesterDiv = document.createElement("div");
        semesterDiv.className = "semester";
        semesterDiv.innerHTML = `<h2>${semester.name}</h2>`;

        let allUnlocked = true;

        for (const subject of semester.subjects) {
            const subjDiv = document.createElement("div");
            subjDiv.className = "subject";
            subjDiv.textContent = subject.name;
            subjDiv.dataset.id = subject.id;

            if (!isUnlocked(subject)) {
                subjDiv.style.opacity = "0.4";
                subjDiv.style.pointerEvents = "none";
                allUnlocked = false;
            }

            if (completed.has(subject.id)) {
                subjDiv.classList.add("completed");
            }

            subjDiv.addEventListener("click", () => {
                if (!completed.has(subject.id)) {
                    completed.add(subject.id);
                } else {
                    completed.delete(subject.id);
                }
                localStorage.setItem("completedSubjects", JSON.stringify([...completed]));
                render();
            });

            semesterDiv.appendChild(subjDiv);
        }

        if (i > 0 && unlockedUntil < i) {
            semesterDiv.classList.add("locked");
        } else if (semester.subjects.every(s => completed.has(s.id))) {
            unlockedUntil = i + 1;
        }

        container.appendChild(semesterDiv);
    }
}

render();
