/* =====================================================================
   BUILT-IN WORDING  (you almost never need to touch this file)

   These are the small texts of the website: buttons, headings, the
   countdown, and so on, in English and in Arabic. The website picks
   the right set using  language: "en" | "ar"  from birthdayData.js.

   Want to change a line? Edit it below, or (easier) override it inside
   the  text: { ... }  section at the bottom of birthdayData.js.

   Special bits you can use inside a text:
     {name}   → the birthday person's name
     {a|b}    → (Arabic only) "a" for a man, "b" for a woman.
                Example:  "اضغط{|ي}"  →  اضغط (man)  /  اضغطي (woman)
     *word*   → highlights that word in headings
   ===================================================================== */

window.UI_TEXT = {

  /* ------------------------------ ENGLISH ------------------------------ */
  en: {
    pageTitle: "A little surprise for you",

    // Countdown (shown before the birthday)
    cdTitle: "Something special is coming...",
    cdLabel: "Time left until your surprise",
    cdDays: "Days",
    cdHours: "Hours",
    cdMinutes: "Minutes",
    cdSeconds: "Seconds",
    cdUnlocks: "Opens on {date}",
    cdItsYourDay: "IT'S YOUR DAY! 🎉",
    cdBegin: "Begin",

    // Opening screen
    openLine1: "I made something for you...",
    openLine2: "Don't rush. Take your time.",
    openButton: "Open Your Surprise",

    // Birthday reveal
    revealKicker: "Happy Birthday",
    next: "Continue",

    // Buttons that lead into the next part of the story
    go_letter: "Read your letter",
    go_memories: "See our memories",
    go_story: "Our story",
    go_loves: "Keep going",
    go_quiz: "Play a little game",
    go_secret: "There's more",
    go_gift: "One last thing",
    go_finale: "Continue",

    // Letter sign-off (only shown if senderName is filled in)
    signoff: "With all my love,",

    // Letter
    letterTitle: "A letter, just for you",
    letterHint: "Tap the envelope to open it",
    letterOpenAria: "Open the letter",

    // Memories
    memTitle: "Little pieces of us",
    memSub: "Swipe through. Tap a photo to open it.",
    memPrev: "Previous photo",
    memNext: "Next photo",
    memOpen: "Open photo: {title}",
    photoSoon: "Photo coming soon",
    photoCount: "{n} / {total}",
    lbClose: "Close",
    lbPrev: "Previous",
    lbNext: "Next",
    lbLabel: "Photo viewer",

    // Timeline
    storyTitle: "Our story",
    storySub: "How it all unfolded",

    // Things I love
    lovesTitle: "{count} things I love about you",
    lovesSub: "Tap a card to turn it over.",
    lovesProgress: "{done} of {total} revealed",
    lovesDone: "And that's only the beginning.",
    lovesCard: "Card {n}: {title}. Tap to reveal.",

    // Quiz
    quizTitle: "How well do you know us?",
    quizSub: "A few questions. No pressure... okay, a little pressure.",
    quizQ: "Question {n} of {total}",
    quizNext: "Next question",
    quizFinish: "See my result",
    quizAgain: "Play again",
    quizRight: "Yes! ❤️",
    quizWrong: "Not quite 😅",
    quizScore: "{score} / {total}",
    quizYouGot: "Your score",
    quizLetters: "ABCD",

    // Secret
    secretTitle: "There's something I haven't told you yet...",
    secretSub: "Type the password to open it.",
    secretPlaceholder: "Password",
    secretUnlock: "Unlock",
    secretWrong: "Not quite... try again ❤️",
    secretHintBtn: "Need a hint?",
    secretSkip: "Skip for now",
    secretShow: "Show password",
    secretHide: "Hide password",
    secretOpen: "A secret, unlocked",

    // Final gift
    giftTitle: "One last thing...",
    giftHint: "Tap the gift",
    giftAria: "Open the gift",
    giftHeading: "Happy Birthday, {name}",

    // Last screen
    finaleLine: "Here's to another year of memories.",
    finaleMade: "Made with love.",
    finaleReplay: "Watch it again",

    // Music player
    musicTap: "Tap to play music",
    musicPlay: "Play music",
    musicPause: "Pause music",
    musicMore: "Music controls",
    musicVolume: "Volume",
    musicSeek: "Song position",
    musicNow: "Now playing"
  },

  /* ------------------------------ ARABIC ------------------------------ */
  ar: {
    pageTitle: "مفاجأة صغيرة ليك{|ي}",

    cdTitle: "في حاجة مميزة جاية...",
    cdLabel: "الوقت المتبقي على المفاجأة",
    cdDays: "أيام",
    cdHours: "ساعات",
    cdMinutes: "دقايق",
    cdSeconds: "ثواني",
    cdUnlocks: "هتتفتح يوم {date}",
    cdItsYourDay: "النهارده يومك! 🎉",
    cdBegin: "يلا نبدأ",

    openLine1: "عملتلك حاجة صغيرة...",
    openLine2: "براحتك، خد{|ي} وقتك.",
    openButton: "افتح{|ي} المفاجأة",

    revealKicker: "عيد ميلاد سعيد",
    next: "يلا نكمل",

    // أزرار الانتقال للجزء اللي بعده
    go_letter: "اقر{ا|ي} رسالتك",
    go_memories: "شوف{|ي} ذكرياتنا",
    go_story: "حكايتنا",
    go_loves: "كمّل{|ي}",
    go_quiz: "يلا نلعب",
    go_secret: "في كمان",
    go_gift: "آخر حاجة",
    go_finale: "كمّل{|ي}",

    signoff: "بحبك،",

    letterTitle: "رسالة مخصوصة ليك{|ي}",
    letterHint: "اضغط{|ي} على الظرف عشان تفتح{|ي}ه",
    letterOpenAria: "فتح الرسالة",

    memTitle: "لحظات صغيرة مننا",
    memSub: "اسحب{|ي} بين الصور، واضغط{|ي} على أي صورة عشان تكبّرها.",
    memPrev: "الصورة السابقة",
    memNext: "الصورة التالية",
    memOpen: "فتح الصورة: {title}",
    photoSoon: "الصورة قريبًا",
    photoCount: "{n} / {total}",
    lbClose: "إغلاق",
    lbPrev: "السابق",
    lbNext: "التالي",
    lbLabel: "عارض الصور",

    storyTitle: "حكايتنا",
    storySub: "من أولها",

    lovesTitle: "حاجات بحبها فيك{|ي}",
    lovesSub: "اضغط{|ي} على الكارت عشان تقلب{|ي}ه.",
    lovesProgress: "{done} من {total}",
    lovesDone: "ودي مجرد البداية.",
    lovesCard: "كارت {n}: {title}. اضغط للكشف.",

    quizTitle: "تعرف{|ي} عننا قد إيه؟",
    quizSub: "كام سؤال.. من غير ضغط (تقريبًا).",
    quizQ: "سؤال {n} من {total}",
    quizNext: "السؤال اللي بعده",
    quizFinish: "شوف{|ي} النتيجة",
    quizAgain: "نلعب تاني",
    quizRight: "صح! ❤️",
    quizWrong: "لأ، مش بالظبط 😅",
    quizScore: "{score} / {total}",
    quizYouGot: "نتيجتك",
    quizLetters: "أبجد",

    secretTitle: "في حاجة لسه ما قلتلك{|ي}ش عليها...",
    secretSub: "اكتب{|ي} كلمة السر عشان تفتح{|ي}ها.",
    secretPlaceholder: "كلمة السر",
    secretUnlock: "فتح",
    secretWrong: "لأ مش كده.. جرب{|ي} تاني ❤️",
    secretHintBtn: "محتاج{|ة} تلميح؟",
    secretSkip: "بعدين",
    secretShow: "إظهار كلمة السر",
    secretHide: "إخفاء كلمة السر",
    secretOpen: "سر اتفتح",

    giftTitle: "آخر حاجة...",
    giftHint: "اضغط{|ي} على الهدية",
    giftAria: "فتح الهدية",
    giftHeading: "عيد ميلاد سعيد يا {name}",

    finaleLine: "وسنة جديدة مليانة ذكريات.",
    finaleMade: "اتعمل بحب.",
    finaleReplay: "شوف{|ي} الحكاية تاني",

    musicTap: "اضغط{|ي} لتشغيل الموسيقى",
    musicPlay: "تشغيل الموسيقى",
    musicPause: "إيقاف الموسيقى",
    musicMore: "التحكم في الموسيقى",
    musicVolume: "الصوت",
    musicSeek: "موضع الأغنية",
    musicNow: "بتسمع دلوقتي"
  }
};
