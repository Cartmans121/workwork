"use strict"

$(document).ready(function () {
    $(".form__select").select2({
        theme: "classic", // Вы можете выбрать другие темы по вашему усмотрению
        placeholder: "Вы меня возьмете на работу?",
        allowClear: true // Добавить опцию "Очистить" для сброса выбора
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);

        let formData = new FormData(form);
        formData.append('image', formImage.files[0]);
        
        if (error === 0) {
            form.classList.add('_sending');
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body:formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';
                form.reset();
                form.classList.remove('_sending');
            } else {
                alert("ОШИБКА!");
                form.classList.remove('_sending');
            }
        } else {
            alert('Заполните обязательные поля!')
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && !input.checked) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    // Функция теста email
    function emailTest(input) {
        return !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(input.value);
    }

    // Получаем инпут file в переменную
    const formImage = document.getElementById('formImage');
    // Получаем див для превью в переменную
    const formPreview = document.getElementById('formPreview');

    // Слушаем изменения в инпуте file
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    });

    function uploadFile(file){
        // проверяем тип файла
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)){
            alert('Разрешены только изображения.')
            formImage.value = '';
            return;
        }
        // Проверим размер файла (<2 Мб)
        if (file.size > 2 * 1024 * 1024) {
            alert ('Файл должен быть менее 2 МБ.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
        };
        reader.onerror = function (e) {
            alert ('Ошибка');
        };
        reader.readAsDataURL(file);
    }
});
