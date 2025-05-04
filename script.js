document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('transferForm');
    const transfersTable = document.getElementById('transfersTableBody');
    const historyList = document.getElementById('historyList');
    
    // Загрузка истории из localStorage
    loadHistory();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные из формы
        const bankName = document.getElementById('bankName').value;
        const recipientCard = formatCardNumber(document.getElementById('recipientCard').value);
        const recipientName = document.getElementById('recipientName').value;
        const senderCard = formatCardNumber(document.getElementById('senderCard').value);
        const amount = document.getElementById('amount').value;
        
        // Добавляем перевод в таблицу
        addTransferToTable(bankName, recipientCard, senderCard, amount);
        
        // Добавляем в историю
        addToHistory(bankName, recipientCard, senderCard, amount);
        
        // Очищаем форму
        form.reset();
    });
    
    // Форматирование номера карты (XXXX XXXX XXXX XXXX)
    function formatCardNumber(number) {
        return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Добавление перевода в таблицу
    function addTransferToTable(bank, toCard, fromCard, amount) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${bank}</td>
            <td>${toCard}</td>
            <td>${fromCard}</td>
            <td>${amount} ₽</td>
        `;
        
        transfersTable.prepend(row);
    }
    
    // Добавление в историю и сохранение
    function addToHistory(bank, toCard, fromCard, amount) {
        const item = document.createElement('li');
        item.textContent = `${bank}: ${amount} ₽`;
        
        // Сохраняем данные в атрибутах для повторного использования
        item.dataset.bank = bank;
        item.dataset.toCard = toCard;
        item.dataset.fromCard = fromCard;
        item.dataset.amount = amount;
        
        item.addEventListener('click', function() {
            document.getElementById('bankName').value = this.dataset.bank;
            document.getElementById('recipientCard').value = this.dataset.toCard.replace(/\s/g, '');
            document.getElementById('senderCard').value = this.dataset.fromCard.replace(/\s/g, '');
            document.getElementById('amount').value = this.dataset.amount;
        });
        
        historyList.prepend(item);
        
        // Сохраняем в localStorage
        saveHistory();
    }
    
    // Сохранение истории в localStorage
    function saveHistory() {
        const items = [];
        historyList.querySelectorAll('li').forEach(item => {
            items.push({
                bank: item.dataset.bank,
                toCard: item.dataset.toCard,
                fromCard: item.dataset.fromCard,
                amount: item.dataset.amount
            });
        });
        
        localStorage.setItem('transferHistory', JSON.stringify(items));
    }
    
    // Загрузка истории из localStorage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('transferHistory')) || [];
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.bank}: ${item.amount} ₽`;
            li.dataset.bank = item.bank;
            li.dataset.toCard = item.toCard;
            li.dataset.fromCard = item.fromCard;
            li.dataset.amount = item.amount;
            
            li.addEventListener('click', function() {
                document.getElementById('bankName').value = this.dataset.bank;
                document.getElementById('recipientCard').value = this.dataset.toCard.replace(/\s/g, '');
                document.getElementById('senderCard').value = this.dataset.fromCard.replace(/\s/g, '');
                document.getElementById('amount').value = this.dataset.amount;
            });
            
            historyList.appendChild(li);
        });
    }
    
    // Валидация номера карты в реальном времени
    document.getElementById('recipientCard').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 16);
    });
    
    document.getElementById('senderCard').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 16);
    });
});