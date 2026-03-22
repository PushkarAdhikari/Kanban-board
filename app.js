const columns = document.querySelectorAll('.column');
let draggedTask = null;

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-btn')) {
        const text = prompt('Enter the task');

        if (!text.trim()) {
            alert('Please enter a task!');
            return;
        };

        const task = document.createElement('div');
        task.className = 'task';
        task.textContent = text;

        task.setAttribute('draggable', true);

        const column = e.target.closest('.column');
        e.target.previousElementSibling.appendChild(task);

        columnCounts(column);
    }
})

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task')) {
        draggedTask = e.target;
        e.target.classList.add('dragging');
    }
})
document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task')) {
        e.target.classList.remove('dragging');
        draggedTask = null;
    }
})

function columnCounts(column) {
    const tasks = column.querySelectorAll('.tasks .task').length;
    const taskCount = column.querySelector('.total-tasks');
    taskCount.textContent = tasks;
}

columns.forEach((col) => {
    col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over')
    });

    col.addEventListener('dragleave', (e) => {
        col.classList.remove('drag-over')
    });

    col.addEventListener('drop', (e) => {
        col.classList.remove('drag-over');
        if (draggedTask) {
            const sourceColumn = draggedTask.closest('.column');
            col.querySelector('.tasks').appendChild(draggedTask);
            columnCounts(sourceColumn);
            columnCounts(col);

        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    columns.forEach((col) => {
        columnCounts(col);
    });
});