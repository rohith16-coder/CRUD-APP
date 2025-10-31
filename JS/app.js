class CRUDApp {
    constructor() {
        this.items = this.loadItems();
        this.editingId = null;
        this.initElements();
        this.bindEvents();
        this.render();
    }

    initElements() {
        this.form = document.getElementById('itemForm');
        this.input = document.getElementById('itemInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.itemList = document.getElementById('itemList');
        this.emptyState = document.getElementById('emptyState');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        
        if (!text || text.length > 100) {
            this.showError('Item must be 1-100 characters');
            return;
        }

        if (this.editingId) {
            this.updateItem(this.editingId, text);
        } else {
            this.createItem(text);
        }
        
        this.input.value = '';
        this.resetForm();
        this.saveItems();
        this.render();
    }

    createItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            createdAt: new Date().toISOString()
        };
        this.items.unshift(item);
    }

    updateItem(id, newText) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.text = newText;
            item.updatedAt = new Date().toISOString();
        }
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveItems();
        this.render();
    }

    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            this.input.value = item.text;
            this.editingId = id;
            this.submitBtn.textContent = 'Update Item';
            this.input.focus();
        }
    }

    resetForm() {
        this.editingId = null;
        this.submitBtn.textContent = 'Add Item';
    }

    render() {
        this.itemList.innerHTML = '';
        
        if (this.items.length === 0) {
            this.emptyState.hidden = false;
            return;
        }
        
        this.emptyState.hidden = true;
        
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item';
            li.innerHTML = `
                <span class="item-text">${this.escapeHtml(item.text)}</span>
                <div>
                    <button class="edit-btn" onclick="app.editItem(${item.id})" aria-label="Edit ${this.escapeHtml(item.text)}">Edit</button>
                    <button class="delete-btn" onclick="app.deleteItem(${item.id})" aria-label="Delete ${this.escapeHtml(item.text)}">Delete</button>
                </div>
            `;
            this.itemList.appendChild(li);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        this.input.setCustomValidity(message);
        this.input.reportValidity();
        setTimeout(() => this.input.setCustomValidity(''), 3000);
    }

    saveItems() {
        try {
            localStorage.setItem('crudAppItems', JSON.stringify(this.items));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    loadItems() {
        try {
            const saved = localStorage.getItem('crudAppItems');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            return [];
        }
    }
}

const app = new CRUDApp();