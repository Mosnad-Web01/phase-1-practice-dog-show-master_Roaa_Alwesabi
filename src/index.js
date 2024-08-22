document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const dogForm = document.getElementById('dog-form');
    let currentDogId = null;
  
    // جلب قائمة الكلاب عند تحميل الصفحة
    function fetchDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          tableBody.innerHTML = '';
          dogs.forEach(dog => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button data-id="${dog.id}">Edit</button></td>
            `;
            tableBody.appendChild(row);
          });
        });
    }
  
    // إضافة حدث للنقر على أزرار التعديل
    tableBody.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON') {
        const dogId = event.target.getAttribute('data-id');
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then(response => response.json())
          .then(dog => {
            dogForm.name.value = dog.name;
            dogForm.breed.value = dog.breed;
            dogForm.sex.value = dog.sex;
            currentDogId = dogId;
          });
      }
    });
  
    // إضافة حدث لإرسال النموذج
    dogForm.addEventListener('submit', event => {
      event.preventDefault();
      const updatedDog = {
        name: dogForm.name.value,
        breed: dogForm.breed.value,
        sex: dogForm.sex.value
      };
  
      fetch(`http://localhost:3000/dogs/${currentDogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDog)
      })
        .then(response => response.json())
        .then(() => {
          fetchDogs(); // تحديث الجدول بعد التعديل
          dogForm.reset(); // إعادة تعيين النموذج
          currentDogId = null; // إعادة تعيين معرّف الكلب الحالي
        });
    });
  
    fetchDogs(); // جلب الكلاب عند تحميل الصفحة
  });
  