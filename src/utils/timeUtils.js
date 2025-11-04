// Function to get time-based greeting messages with different tones
export function getTimeBasedGreeting() {
  const now = new Date();
  const hour = now.getHours();

  // Array of greeting messages for each time period
  const morningGreetings = [
    "☀️ Good morning! How can I help you grow your business with AI today?",
    "Morning! Ready to explore AI-powered solutions for your business?",
    "Good morning! Let's discover how AI can transform your business."
  ];

  const afternoonGreetings = [
    "Hey 👋 Hope your day's going well! How can I assist you?",
    "Welcome! Let's explore AI solutions for your business."
  ];

  const eveningGreetings = [
    "Good evening! How can I help you with AI solutions today?",
    "Hey! I'm here to help you discover AI-powered tools for your business.",
    "Good evening! Ready to explore what Troika Tech has to offer?"
  ];

  const lateNightGreetings = [
    "🌙 Working late? I'm here to help you with AI solutions.",
    "You're up late, and so am I. Let's explore AI opportunities together.",
    "Still working? Let me help you discover how AI can grow your business."
  ];

  let selectedGreeting;

  if (hour >= 6 && hour < 12) {
    // Morning (6 AM – 11 AM) → Fresh & Energetic
    const randomIndex = Math.floor(Math.random() * morningGreetings.length);
    selectedGreeting = morningGreetings[randomIndex];
  } else if (hour >= 12 && hour < 18) {
    // Afternoon (12 PM – 5 PM) → Friendly & Helpful
    const randomIndex = Math.floor(Math.random() * afternoonGreetings.length);
    selectedGreeting = afternoonGreetings[randomIndex];
  } else if (hour >= 18 && hour < 24) {
    // Evening/Night (6 PM – 11 PM) → Relaxed & Supportive
    const randomIndex = Math.floor(Math.random() * eveningGreetings.length);
    selectedGreeting = eveningGreetings[randomIndex];
  } else {
    // Late Night (12 AM – 5 AM) → Quirky & Reassuring
    const randomIndex = Math.floor(Math.random() * lateNightGreetings.length);
    selectedGreeting = lateNightGreetings[randomIndex];
  }

  return selectedGreeting;
}
