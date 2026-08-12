(() => {
function createUi({ onTopicConfirmed, onHelpOpened, onHelpClosed }) {
  const topicModal = document.querySelector('#topicModal');
  const helpModal = document.querySelector('#helpModal');
  const topicOptions = [...document.querySelectorAll('.topic-option')];
  const confirmTopic = document.querySelector('#confirmTopic');
  let selectedTopic = null;
  let locked = false;

  const openModal = (modal) => { modal.hidden = false; modal.querySelector('button')?.focus(); };
  const closeModal = (modal) => { modal.hidden = true; };
  const clearTopic = () => {
    selectedTopic = null;
    topicOptions.forEach((item) => item.setAttribute('aria-checked', 'false'));
    confirmTopic.disabled = true;
  };
  const openTopic = () => { clearTopic(); locked = false; openModal(topicModal); };
  const closeTopic = () => { clearTopic(); closeModal(topicModal); document.querySelector('#startButton').focus(); };
  const openHelp = () => { onHelpOpened?.(); openModal(helpModal); };
  const closeHelp = () => { closeModal(helpModal); onHelpClosed?.(); };

  document.querySelector('#startButton').addEventListener('click', openTopic);
  document.querySelector('#closeTopic').addEventListener('click', closeTopic);
  document.querySelectorAll('[data-open-help]').forEach((button) => button.addEventListener('click', openHelp));
  document.querySelector('#closeHelp').addEventListener('click', closeHelp);

  topicOptions.forEach((option) => option.addEventListener('click', () => {
    selectedTopic = option.dataset.topic;
    topicOptions.forEach((item) => item.setAttribute('aria-checked', String(item === option)));
    confirmTopic.disabled = false;
  }));

  confirmTopic.addEventListener('click', () => {
    if (locked || !selectedTopic) return;
    locked = true;
    confirmTopic.disabled = true;
    closeModal(topicModal);
    onTopicConfirmed(selectedTopic);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!helpModal.hidden) closeHelp();
    else if (!topicModal.hidden) closeTopic();
  });

  return { getSelectedTopic: () => selectedTopic, openTopic };
}

window.GoldRushUi = { createUi };
})();
