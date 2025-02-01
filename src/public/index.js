document.addEventListener('DOMContentLoaded', () => {
  const faqList = document.getElementById('faq-list');
  const pageSizeInput = document.getElementById('page-size');
  const reloadBtn = document.getElementById('reload-btn');
  const createForm = document.getElementById('create-faq-form');
  const updateForm = document.getElementById('update-faq-form');
  const deleteAllBtn = document.getElementById('delete-all-btn');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageInfo = document.getElementById('page-info');
  let currentPage = 1;
  let totalPages = 1;

  const loadFAQs = async () => {
    const pageSize = pageSizeInput.value;
    const response = await fetch(`/api/get?p=${currentPage}&len=${pageSize}&lang=en`);
    const result = await response.json();
    addFAQsToDOM(result.data);
    totalPages = Math.ceil(result.total[0].count / pageSize);
    updatePaginationControls();
  };

  const addFAQsToDOM = (faqs) => {
    faqList.innerHTML = ''; // Clear the current list
    faqs.forEach(faq => {
      const div = document.createElement('div');
      div.dataset.id = faq._id;
      div.classList.add('faq-item');
      div.innerHTML = `<div class="faq-question">Q. ${faq.question}</div>
                       <div class="faq-answer">A. ${faq.answer}</div>
                       <div class="faq-controls">
                         <i class="fas fa-edit" onclick="showUpdateForm('${faq._id}', '${faq.question}', '${faq.answer}')"></i>
                         <i class="fas fa-trash" onclick="deleteFAQ('${faq._id}')"></i>
                       </div>`;
      faqList.appendChild(div);
    });
  };

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = document.getElementById('create-question').value;
    const answer = document.getElementById('create-answer').value;

    await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer })
    });

    loadFAQs();
  });

  const showUpdateForm = (id, question, answer) => {
    document.getElementById('update-id').value = id;
    document.getElementById('update-question').value = question;
    document.getElementById('update-answer').value = answer;
    updateForm.classList.remove('hidden');
  };

  window.showUpdateForm = showUpdateForm;

  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('update-id').value;
    const question = document.getElementById('update-question').value;
    const answer = document.getElementById('update-answer').value;

    await fetch(`/api/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer })
    });

    updateForm.classList.add('hidden');
    loadFAQs();
  });

  const deleteFAQ = async (id) => {
    await fetch(`/api/deleteone/${id}`, {
      method: 'DELETE'
    });
    loadFAQs();
  };

  window.deleteFAQ = deleteFAQ;

  deleteAllBtn.addEventListener('click', async () => {
    await fetch('/api/deleteall', {
      method: 'DELETE'
    });
    loadFAQs();
  });

  reloadBtn.addEventListener('click', loadFAQs);
  pageSizeInput.addEventListener('change', loadFAQs);
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadFAQs();
    }
  });
  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadFAQs();
    }
  });

  const updatePaginationControls = () => {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  };

  loadFAQs();
});
