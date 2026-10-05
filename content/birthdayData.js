/* =====================================================================
   ✏️  THIS IS THE ONLY FILE YOU NEED TO EDIT  ✏️

   Everything personal lives here: the name, the date, the message,
   the photos, the timeline, the quiz, the password...

   HOW TO EDIT (very simple):
   • Change only the text between the quotes  "like this".
   • Don't delete the quotes, the commas at the end of lines, or the
     { } [ ] brackets.
   • Anything after two slashes  //  is just a note for you. The
     website ignores it.
   • For messages that have several lines, we use `backticks` (the key
     to the left of the number 1) instead of quotes.

   ⚠️  Everything currently in this file is SAMPLE (placeholder) content
       so you can see the whole experience. Replace it with your own.
   ===================================================================== */

window.BIRTHDAY_DATA = {

  /* =================================================================
     1) THE BASICS
     ================================================================= */

  // Language of the website: "en" = English   |   "ar" = Arabic (right-to-left)
  language: "en",

  // Only matters when language is "ar" (Arabic changes the wording for
  // a woman or a man):  "female"  or  "male"
  recipientGender: "female",

  // ⬇️ PUT THEIR NAME HERE  (it appears in big letters on the reveal screen)
  recipientName: "Arwa",

  // ⬇️ YOUR name. It is written at the end of the letter.  Leave "" for none.
  senderName: "Amr",

  // ⬇️ THE BIRTHDAY, exactly like this:  "YEAR-MONTH-DAY" + "T" + "HOUR:MINUTE:SECOND"
  //    Example: 25 December 2026 at midnight  →  "2026-12-25T00:00:00"
  //
  //    • Before this moment the website shows a countdown ("Something special is coming...").
  //    • After it, the website shows the full surprise.
  //    • The date below is in the past ON PURPOSE, so you can see the whole
  //      experience right now. Put the real date when you're ready.
  birthdayDate: "2026-10-07T00:00:00",

  // The time zone where the birthday person lives (so the countdown ends at
  // THEIR midnight). Examples: "Africa/Cairo", "Asia/Riyadh", "Asia/Dubai",
  // "Europe/London", "America/New_York"
  timezone: "Africa/Cairo",

  // A short line under their name on the reveal screen.
  personalLine: "This little world was made just for you.",


  /* =================================================================
     2) MUSIC
     Put your song inside the folder  assets/music/  and name it  song.mp3
     (or change the file name here).
     ================================================================= */

  musicFile: "assets/music/10Khalik_Maaaya.mp3",
  musicTitle: "Khalik Maaaya",       // ✏️ replace
  musicArtist: "Amr Diab",          // ✏️ replace


  /* =================================================================
     3) THE LETTER  (the personal birthday message)
     Tips:
       • {name} is automatically replaced with their name.
       • A new line = press Enter.  A new paragraph = leave an empty line.
       • Put *stars* around words you want to highlight.
     ================================================================= */

  birthdayMessage: `Dear {Batata},

Today is *your day* — and I wanted to make something that feels the way you make me feel.

I don't say it often enough, but I'm so grateful for you.
For the little things. The loud laughs. The quiet moments in between.

I hope this year gives you everything you keep giving to the people around you.

I honestly don't know what to write or what to say, but if I had only one wish, it would be to have you by my side for the rest of my life and to always see you happy.

Your birthday is one of the best days that could ever come into my life, and on this day, I thank God with all my heart for everything... especially for having you in my life.

I love you. ❤️ {Rero}.`,


  /* =================================================================
     4) MEMORIES  (the photo gallery)
     Put your photos inside  assets/images/  then write each photo's file
     name below.  Copy one { ... }, block to add another photo, delete a
     block to remove one.
       image     → the photo file
       date      → shown small, e.g. "June 2024"
       title     → the memory's name (shown on the photo)
       caption   → a short line (shown when the photo is opened)
       location  → optional, e.g. "Alexandria"
       memory    → optional, a longer little story about this photo
     Anything you don't need can be left as ""  (empty).
     ================================================================= */

  memories: [
    {
      image: "assets/images/First Outing.jpeg",
      date: "May 2017",
      title: "Our first memory",
      caption: "ايام الشقاوة.",
      location: "Dream Park",
      memory: "مفاجأتي اللي مش بتخلص في كل مكان هتلاقيني., كانت احلى شيله هاا, Don't Say Bad Words Haa, Best Memories Ever?"
    },
    {
      image: "assets/images/First Meeting.jpeg",
      date: "October 2026",
      title: "A day I never want to forget",
      caption: "Freedome.",
      location: "Cairo",
      memory: "First time I met you, I was so nervous and excited. I remember every detail of that day,And I realized how much I love you."
    },
    {
      image: "assets/images/Boat.jpeg",
      date: "August 2026",
      title: "Our favorite adventure",
      caption: "Very special day, I will never forget it.",
      location: "Ras El Bar",
      memory: "Sfria Tani Mn De We Aldounia Tb2a Tmam awii."
    },
    {
      image: "assets/images/College.jpeg",
      date: "February 2026",
      title: "That perfect little moment",
      caption: "Simple. Quiet. Ours.",
      location: "Cairo University",
      memory: "Nothing To Say, Just Being With You Is Enough."
    },
    {
      image: "assets/images/Car.jpeg",
      date: "March 2026",
      title: "Laughing at nothing",
      caption: "Daddy Finger hahahahahahaha.",
      location: "Cairo",
      memory: "Aw3a Al Finger Bitl3 Mn Ai heta Nehahahahaha."
    },
    {
      image: "assets/images/Clup.jpeg",
      date: "October 2025",
      title: "A quiet Night",
      caption: "Always Escape From The World.",
      location: "Wadi Degla Sheraton",
      memory: "Peaceful Night, Just Us, No One Else."
    },
    {
      image: "assets/images/Monem.jpeg",
      date: "April 2026",
      title: "Just us",
      caption: "And That All I need.",
      location: "Cairo",
      memory: "First Dance Together"
    },
    {
      image: "assets/images/Monofia.jpeg",
      date: "June 2026",
      title: "Family Trip",
      caption: "The peace I'll always want.",
      location: "Monofia",
      memory: "First Travel Together"
    },
    {
      image: "assets/images/Eid.jpeg",
      date: "March 2026",
      title: "Eid Together",
      caption: "Fast And Furious , Daiman Bnhrb , No Risk No Fun Ha.",
      location: "Cairo",
      memory: "Eid With Family"
    },
    {
      image: "assets/images/Movie.jpeg",
      date: "August 2026",
      title: "Cenima Night",
      caption: "Awl Mara Nod5ol Film Mn Awlo.",
      location: "Cairo",
      memory: "The first time I drove you home late at night."
    },
    {
      image: "assets/images/Wedding.jpeg",
      date: "May 2026",
      title: "Another chapter",
      caption: "And the story keeps going.",
      location: "Cairo",
      memory: "Engagement Day"
    }
  ],


  /* =================================================================
     5) OUR STORY  (the timeline)
     Each item:  date, title, description, and an optional image
     (use "" if there's no photo for that moment).
     ================================================================= */

  timeline: [
    {
      date: "March 2017",
      title: "That First Day",
      description: "Our first birthday together, and the first gift you ever gave me.",
      image: "assets/images/First Surprise.jpeg"
    },
    {
      date: "May 2023",
      title: "Our First Crazy Memory",
      description: "Slipper ha Asmo Shbshb Bardo.",
      image: "assets/images/Slipper.jpeg"
    },
    {
      date: "June 2026",
      title: "One of My Favorite Days",
      description: "Forever.",
      image: "assets/images/Zodiac.jpeg"
    },
    {
      date: "Today",
      title: "And This Is Just the Beginning",
      description: "The best part of a story is that it isn't finished.",
      image: ""
    }
  ],


  /* =================================================================
     6) THINGS I LOVE ABOUT YOU  (tap-to-flip cards)
     title → what's written on the front of the card
     text  → what's revealed on the back (1–2 sentences works best)
     Add or remove blocks freely: the heading counts them for you.
     ================================================================= */

  thingsILove: [
    { title: "Your smile", text: "Your smile is the most beautiful smile I've ever seen." },
    { title: "The way you laugh", text: "I love making you laugh, especially because I love the way you laugh." },
    { title: "Your crazy personality", text: "I always thought I was crazy… until I met you." },
    { title: "The little things you do", text: "Every little thing you do that you think I don't notice means so much to me." },
    { title: "Your kindness", text: "You have the kindest heart in the whole world." },
    { title: "Your voice", text: "Especially when you've just woken up… or when you're in your Haifa mood. 😂" },
    { title: "How safe you make me feel", text: "I tell you everything because I know you'll never misunderstand me." },
    { title: "Your beautiful mind", text: "You're genuinely so smart… and that photographic memory? Come on." },
    { title: "Your strength", text: "You're as soft as a potato, but somehow you can handle anything life throws at you." },
    { title: "Just being you", text: "You are perfect just as you are, and I love you for it." }
  ],


  /* =================================================================
     7) THE QUIZ  "How well do you know us?"
     For each question:
       question    → the question
       options     → the answers (2 to 4 of them)
       correct     → which answer is right:  1 = first, 2 = second,
                     3 = third, 4 = fourth
       explanation → optional, a little comment shown after they answer
     ================================================================= */

  quizQuestions: [
    {
      question: "Where was our first date? (sample question)",
      options: ["A café", "A long walk", "The cinema", "A restaurant"],
      correct: 1,
      explanation: ""
    },
    {
      question: "What's my favorite thing to do with you? (sample question)",
      options: ["Watching movies", "Road trips", "Cooking together", "Doing absolutely nothing"],
      correct: 4,
      explanation: ""
    },
    {
      question: "Which one of these would I always choose for you? (sample question)",
      options: ["Chocolate", "Coffee", "Ice cream", "Pizza"],
      correct: 2,
      explanation: "Of course you knew that ❤️"
    },
    {
      question: "What did I say the first time I saw you? (sample question)",
      options: ["Hi", "Wow", "Nothing. I couldn't speak", "Nice to meet you"],
      correct: 3,
      explanation: ""
    },
    {
      question: "How many photos are in this gallery? (sample question)",
      options: ["Eleven", "Eight", "Twelve", "Twenty"],
      correct: 1,
      explanation: "Look how well you were paying attention 😉"
    }
  ],

  // What they see after the quiz. The website picks the highest "minScore"
  // that their score reaches.  Keep one entry with minScore: 0.
  quizResults: [
    { minScore: 5, title: "Perfect score!", message: "Okay... you actually remember everything 😂❤️" },
    { minScore: 3, title: "Not bad at all", message: "We need to make more memories apparently 😂" },
    { minScore: 1, title: "Hmm...", message: "I'm a little hurt 😂 but I forgive you ❤️" },
    { minScore: 0, title: "Excuse me?!", message: "Excuse me?! We need to talk 😂" }
  ],


  /* =================================================================
     8) THE SECRET MESSAGE  (locked until they type the password)
     The password is NOT shown anywhere on the website.
     Capital letters, spaces and dashes don't matter when they type it.
     ================================================================= */

  password: "13/10/2025",                              // ⬅️ change me (a date, a word, a nickname...)
  passwordHint: "Sample password: Day/Month/Year. Special date for me",   // shown if they need help. Use "" for no hint.

  secretMessage: `This is the part I was too shy to say out loud.

You matter to me more than I know how to put into words.

One of the biggest things that makes me wake up every day, keep going, try new things, and become a better person in every way is the thought of having you in my life.

I'm honestly scared of a life without you. I don't even know what it would look like, and I don't want to find out. Just thinking about it scares me more than I can explain.

All I know is that I don't want to live this life without you by my side.

I love you, Rero. ❤️

And honestly, your birthday is one of the most beautiful things that ever happened in my life, because you are so much more than just a part of my life.

**You are everything to me.**
.`,


  /* =================================================================
     9) THE FINAL GIFT
     ================================================================= */

  finalThanks: "Thank you for being part of my life.",

  finalMessage: `I hope today feels as special as you are.

Here's to laughing more, worrying less, and making a lot more memories together.

 I Love You, Rero.`,


  /* =================================================================
     10) OPTIONAL: change any built-in wording
     All the small texts of the website (buttons, headings, "Something
     special is coming...", etc.) live in  content/ui-text.js .
     If you only want to change a few, you can override them here.
     Remove the two slashes at the start of a line to activate it.
     ================================================================= */

  text: {
    // openLine1: "I made something for you...",
    // openLine2: "Don't rush. Take your time.",
    // openButton: "Open Your Surprise",
    // finaleLine: "Here's to another year of memories.",
    // finaleMade: "Made with love.",
  }
};
