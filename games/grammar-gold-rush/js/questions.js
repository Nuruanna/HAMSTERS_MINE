(() => {
  const TOPIC_KEYS = Object.freeze({
    'Present Simple': 'presentSimple',
    'Present Continuous': 'presentContinuous',
    'Past Simple': 'pastSimple',
    'Future Forms': 'futureForms'
  });
  const queues = new Map();
  const lastPrompts = new Map();

  function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function getQuestion(topic, poolName = 'multipleChoice') {
    const topicKey = TOPIC_KEYS[topic] || 'presentSimple';
    const pool = window.GRAMMAR_GOLD_RUSH_QUESTIONS[topicKey][poolName];
    const queueKey = `${topicKey}:${poolName}`;
    let queue = queues.get(queueKey);
    if (!queue?.length) {
      queue = shuffled(pool);
      const previousPrompt = lastPrompts.get(queueKey);
      if (queue.length > 1 && queue[0].prompt === previousPrompt) [queue[0], queue[1]] = [queue[1], queue[0]];
      queues.set(queueKey, queue);
    }
    const question = queue.shift();
    lastPrompts.set(queueKey, question.prompt);
    return question;
  }

  window.GoldRushQuestions = { getQuestion };
})();
