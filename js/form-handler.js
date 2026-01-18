// Обработчик формы заявки
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.initPhoneMask();
    }
    
    initPhoneMask() {
        const phoneInput = this.form.querySelector('input[type="tel"]');
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = '+7 (' + value;
                } else if (value.length <= 6) {
                    value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3);
                } else if (value.length <= 8) {
                    value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6);
                } else {
                    value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 10);
                }
            }
            e.target.value = value;
        });
    }
    
    validateForm() {
        let isValid = true;
        const errors = {};
        
        // Проверка имени
        const nameInput = this.form.querySelector('#name');
        if (nameInput && !nameInput.value.trim()) {
            errors.name = 'Введите имя';
            isValid = false;
        }
        
        // Проверка email
        const emailInput = this.form.querySelector('#email');
        if (emailInput) {
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                errors.email = 'Введите корректный email';
                isValid = false;
            }
        }
        
        // Проверка телефона
        const phoneInput = this.form.querySelector('#phone');
        if (phoneInput) {
            const phone = phoneInput.value.replace(/\D/g, '');
            if (!phone || phone.length < 10) {
                errors.phone = 'Введите корректный номер телефона';
                isValid = false;
            }
        }
        
        // Показ ошибок
        this.showErrors(errors);
        return isValid;
    }
    
    showErrors(errors) {
        // Сначала скрываем все ошибки
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Показываем новые ошибки
        for (const [field, message] of Object.entries(errors)) {
            const input = this.form.querySelector(`[name="${field}"]`) || this.form.querySelector(`#${field}`);
            if (input) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message text-danger mt-1 small';
                errorElement.textContent = message;
                input.parentNode.appendChild(errorElement);
                input.classList.add('is-invalid');
            }
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Показываем загрузку
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Собираем данные формы
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Здесь будет реальная отправка на сервер
            // Пример с использованием Formspree:
            // const response = await fetch('https://formspree.io/f/ваш-id', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Временная имитация отправки
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Показываем сообщение об успехе
            this.showSuccessMessage();
            
            // Сбрасываем форму
            this.form.reset();
            
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            this.showErrorMessage();
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        // Создаем или находим сообщение об успехе
        let successMessage = document.querySelector('.success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message alert alert-success';
            this.form.parentNode.insertBefore(successMessage, this.form);
        }
        
        successMessage.textContent = 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
        successMessage.style.display = 'block';
        
        // Прячем сообщение через 5 секунд
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
    
    showErrorMessage() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message alert alert-danger mt-3';
        errorMessage.textContent = 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.';
        this.form.parentNode.insertBefore(errorMessage, this.form);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// Инициализация обработчика форм при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = new FormHandler('application-form');
});