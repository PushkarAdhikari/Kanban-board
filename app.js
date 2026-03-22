const columns = document.querySelectorAll('.column');
let draggedTask = null;

/* ---------- SAVE ---------- */
function saveTasks() {
    const board = [];


    columns.forEach(col => {
        const columnName = col.dataset.status;
        const tasks = [];

        col.querySelectorAll('.task').forEach(task => {
            tasks.push(task.textContent);
        });

        board.push({ column: columnName, tasks });
    });

    localStorage.setItem('kanbanData', JSON.stringify(board));
}

/* ---------- LOAD ---------- */
function loadTasks() {
    const data = JSON.parse(localStorage.getItem('kanbanData'));
    if (!data) return;

    data.forEach(colData => {
        const column = document.querySelector(`[data-status="${colData.column}"]`);
        const taskContainer = column.querySelector('.tasks');

        colData.tasks.forEach(text => {
            const task = createTask(text);
            taskContainer.appendChild(task);
        });
    });
}

/* ---------- CREATE TASK ---------- */
function createTask(text) {
    const task = document.createElement('div');
    task.className = 'task';
    task.textContent = text;
    task.setAttribute('draggable', true);
    return task;
}

/* ---------- COUNT ---------- */
function columnCounts(column) {
    const count = column.querySelectorAll('.task').length;
    column.querySelector('.total-tasks').textContent = count;
}

function updateAllCounts() {
    columns.forEach(columnCounts);
}

/* ---------- ADD TASK ---------- */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-btn')) {
        const text = prompt('Enter task');
        if (!text || !text.trim()) return;

        const task = createTask(text);
        const column = e.target.closest('.column');

        column.querySelector('.tasks').appendChild(task);

        updateAllCounts();
        saveTasks();
    }
});

/* ---------- DRAG ---------- */
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task')) {
        draggedTask = e.target;
        e.target.classList.add('dragging');
    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task')) {
        e.target.classList.remove('dragging');
        draggedTask = null;
    }
});

/* ---------- DROP ---------- */
columns.forEach(col => {

    col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
    });

    col.addEventListener('drop', () => {
        col.classList.remove('drag-over');

        if (draggedTask) {
            col.querySelector('.tasks').appendChild(draggedTask);
            updateAllCounts();
            saveTasks();
        }
    });

});

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateAllCounts();
});