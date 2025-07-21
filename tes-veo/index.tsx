
/* tslint:disable */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";

document.addEventListener('DOMContentLoaded', () => {
    // --- GEMINI API SETUP ---
    if (!process.env.API_KEY) {
      document.body.innerHTML = '<div style="font-family: sans-serif; padding: 2rem; text-align: center; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 8px; margin: 2rem;">Error: API_KEY environment variable is not set. Please configure it to use the application.</div>';
      return;
    }

    // --- CONFIGURATION & STATE ---
    const AppState = {
        currentLang: 'id' as 'id' | 'en',
        currentTheme: 'dark' as 'dark' | 'light',
        storyboardData: null as any,
        isLoggedIn: false,
        personalApiKey: null as string | null,
    };

    const UI_STRINGS = {
        id: {
            langTitle: "Ganti Bahasa",
            themeTitle: "Ganti Tema",
            mainTitle: "Buat Prompt Video Profesional",
            mainSubtitle: "Isi ide Anda, biarkan AI menyusun detailnya, dan dapatkan prompt yang siap pakai untuk VEO atau generator video AI lainnya.",
            stepLabel: "Langkah",
            step1Title: "Ide Pokok & Pengaturan Video",
            step1Subtitle: "Mulailah dengan ide dasar, pengaturan umum, dan jumlah adegan.",
            storyIdeaLabel: "Ide Cerita",
            storyIdeaPlaceholder: "Contoh: Seekor kucing astronot menemukan planet yang terbuat dari benang wol.",
            sceneCountLabel: "Jumlah Adegan",
            videoTypeLabel: "Jenis Video",
            visualStyleLabel: "Gaya Visual",
            generateButton: "Buat Papan Cerita",
            keyCharactersLabel: "Karakter & Objek Kunci",
            editButton: "Ubah",
            saveButton: "Simpan",
            sceneLabel: "Adegan",
            generatePromptsButton: "Hasilkan Prompt",
            combinedPromptTab: "Prompt Gabungan",
            imageMotionPromptTab: "Gambar + Gerakan",
            combinedPromptDescription: "Prompt lengkap untuk generasi Teks-ke-Video.",
            imageMotionPromptDescription: "Hasilkan gambar dulu, lalu gunakan prompt kedua untuk menganimasikannya.",
            imagePromptStepLabel: "Langkah 1: Prompt Gambar",
            animationPromptStepLabel: "Langkah 2: Prompt Gerakan & Audio",
            copyCombinedPrompt: (sceneNumber: number) => `Salin Prompt Adegan ${sceneNumber}`,
            copyImagePrompt: "Salin Prompt Gambar",
            copyAnimationPrompt: "Salin Prompt Gerakan & Audio",
            copyButton: "Salin",
            historyTitle: "Riwayat",
            apiKeyTitle: "Kunci API",
            logoutButton: "Keluar",
            historyModalTitle: "Riwayat Ide Cerita",
            clearHistoryButton: "Bersihkan Riwayat",
            apiKeyModalTitle: "Kelola API Key Gemini",
            defaultApiTitle: "API Sistem Default",
            defaultApiDesc: "Menggunakan API yang disediakan sistem dengan batasan penggunaan harian. Cocok untuk coba-coba.",
            personalApiTitle: "API Pribadi",
            personalApiDesc: "Masukkan API Key Gemini Anda untuk penggunaan tanpa batas. Key Anda disimpan aman di browser.",
            apiKeyPlaceholder: "Masukkan API Key Anda...",
            getApiKeyLink: "Bagaimana cara mendapatkan API Key?",
            deleteButton: "Hapus",
            alertApiKeySaved: "API Key berhasil disimpan!",
            alertApiKeyDeleted: "API Key berhasil dihapus.",
            alertApiKeyEmpty: "Input API Key tidak boleh kosong.",
            alertSceneSaved: "Adegan berhasil diperbarui. Silakan hasilkan ulang prompt jika perlu.",
            alertHistoryCleared: "Riwayat berhasil dibersihkan.",
            alertHistoryEmpty: "Tidak ada riwayat untuk ditampilkan.",
            alertSceneCopied: "Prompt berhasil disalin!",
            alertCopyFailed: "Gagal menyalin prompt.",
            alertIdeaEmpty: "Mohon isi Ide Cerita terlebih dahulu.",
            alertVideoTypeEmpty: "Mohon pilih Jenis Video.",
            alertVisualStyleEmpty: "Mohon pilih Gaya Visual.",
            alertSceneCountEmpty: "Mohon pilih Jumlah Adegan.",
            alertIdeaIncoherent: "Ide cerita tidak jelas atau tidak dapat dipahami. Mohon berikan ide yang lebih spesifik.",
            loaderSystemAI: "Ai Sistem Menganalisa...",
            loaderUserAI: "Ai Anda sedang Menganalisa...",
            alertGenerated: "Papan cerita berhasil dibuat oleh AI!",
            alertPromptGenerated: (count: number) => `${count} prompt berhasil dihasilkan!`,
            alertSuccessTitle: "Berhasil",
            alertErrorTitle: "Terjadi Kesalahan",
            alertInfoTitle: "Informasi",
            alertCloseButton: "Tutup",
            confirmLogoutTitle: "Konfirmasi Logout",
            confirmLogoutMessage: "Apakah Anda yakin ingin keluar?",
            confirmYes: "Ya, Keluar",
            confirmNo: "Tidak",
            alertLoggedOut: "Anda telah berhasil logout.",
            loginWelcome: "Selamat Datang! Silakan Login.",
            loginSubtitle: "Masukkan kata sandi untuk melanjutkan.",
            passwordPlaceholder: "Masukkan Kata Sandi",
            loginButton: "Login",
            loginFailed: "Kata sandi salah!",
            alertTranslationError: "Gagal menerjemahkan adegan.",
            alertSceneTranslated: "Adegan berhasil diterjemahkan.",
            mobileMenuTitle: "Menu",
            secondsUnit: "detik",
        },
        en: {
            langTitle: "Change Language",
            themeTitle: "Change Theme",
            mainTitle: "Create Professional Video Prompts",
            mainSubtitle: "Enter your idea, let the AI handle the details, and get ready-to-use prompts for VEO or other AI video generators.",
            stepLabel: "Step",
            step1Title: "Core Idea & Video Settings",
            step1Subtitle: "Start with the basic idea, general settings, and number of scenes.",
            storyIdeaLabel: "Story Idea",
            storyIdeaPlaceholder: "e.g., An astronaut cat discovers a planet made of yarn.",
            sceneCountLabel: "Number of Scenes",
            videoTypeLabel: "Video Type",
            visualStyleLabel: "Visual Style",
            generateButton: "Generate Storyboard",
            keyCharactersLabel: "Key Characters & Objects",
            editButton: "Edit",
            saveButton: "Save",
            sceneLabel: "Scene",
            generatePromptsButton: "Generate Prompts",
            combinedPromptTab: "Combined Prompt",
            imageMotionPromptTab: "Image + Motion",
            combinedPromptDescription: "A complete prompt for Text-to-Video generation.",
            imageMotionPromptDescription: "Generate the image first, then use the second prompt to animate it.",
            imagePromptStepLabel: "Step 1: Image Prompt",
            animationPromptStepLabel: "Step 2: Motion & Audio Prompt",
            copyCombinedPrompt: (sceneNumber: number) => `Copy Scene ${sceneNumber} Prompt`,
            copyImagePrompt: "Copy Image Prompt",
            copyAnimationPrompt: "Copy Motion & Audio Prompt",
            copyButton: "Copy",
            historyTitle: "History",
            apiKeyTitle: "API Key",
            logoutButton: "Logout",
            historyModalTitle: "Story Idea History",
            clearHistoryButton: "Clear History",
            apiKeyModalTitle: "Manage Gemini API Key",
            defaultApiTitle: "Default System API",
            defaultApiDesc: "Uses the system-provided API with daily usage limits. Suitable for casual use.",
            personalApiTitle: "Personal API",
            personalApiDesc: "Enter your Gemini API Key for unlimited usage. Your key is stored securely in your browser.",
            apiKeyPlaceholder: "Enter your API Key here...",
            getApiKeyLink: "How to get an API Key?",
            deleteButton: "Delete",
            alertApiKeySaved: "API Key saved successfully!",
            alertApiKeyDeleted: "API Key deleted successfully.",
            alertApiKeyEmpty: "API Key input cannot be empty.",
            alertSceneSaved: "Scene updated successfully. Please regenerate prompts if needed.",
            alertHistoryCleared: "History cleared successfully.",
            alertHistoryEmpty: "No history to display.",
            alertSceneCopied: "Prompt copied successfully!",
            alertCopyFailed: "Failed to copy prompt.",
            alertIdeaEmpty: "Please fill in the Story Idea first.",
            alertVideoTypeEmpty: "Please select a Video Type.",
            alertVisualStyleEmpty: "Please select a Visual Style.",
            alertSceneCountEmpty: "Please select the Number of Scenes.",
            alertIdeaIncoherent: "The story idea is unclear or nonsensical. Please provide a more specific idea.",
            loaderSystemAI: "System AI Analyzing...",
            loaderUserAI: "Your AI is Analyzing...",
            alertGenerated: "Storyboard generated successfully by AI!",
            alertPromptGenerated: (count: number) => `${count} prompts generated successfully!`,
            alertSuccessTitle: "Success",
            alertErrorTitle: "An Error Occurred",
            alertInfoTitle: "Information",
            alertCloseButton: "Close",
            confirmLogoutTitle: "Logout Confirmation",
            confirmLogoutMessage: "Are you sure you want to log out?",
            confirmYes: "Yes, Logout",
            confirmNo: "No",
            alertLoggedOut: "You have been successfully logged out.",
            loginWelcome: "Welcome! Please Login.",
            loginSubtitle: "Enter the password to continue.",
            passwordPlaceholder: "Enter Password",
            loginButton: "Login",
            loginFailed: "Incorrect password!",
            alertTranslationError: "Failed to translate scene.",
            alertSceneTranslated: "Scene translated successfully.",
            mobileMenuTitle: "Menu",
            secondsUnit: "seconds",
        }
    };

    const DROPDOWN_OPTIONS = {
        id: {
            videoType: [ { value: 'videoType.none', text: 'Pilih Jenis Video' }, { value: 'videoType.productAd', text: 'Iklan Produk' }, { value: 'videoType.shortFilm', text: 'Film Pendek' }, { value: 'videoType.cinematicReels', text: 'Reels Sinematik' }, { value: 'videoType.storytelling', text: 'Bercerita' }, { value: 'videoType.explainer', text: 'Penjelasan / Edukasi' }, { value: 'videoType.trailer', text: 'Trailer / Teaser' }, { value: 'videoType.podcast', text: 'Podcast' }, { value: 'videoType.vlog', text: 'Vlog / Pribadi' }, { value: 'videoType.romantic', text: 'Cerita Romantis' } ],
            visualStyle: [ { value: 'visualStyle.none', text: 'Pilih Gaya Visual' }, { value: 'visualStyle.cinematic', text: 'Sinematik' }, { value: 'visualStyle.magical', text: 'Magis / Fantasi' }, { value: 'visualStyle.action', text: 'Aksi' }, { value: 'visualStyle.futuristic', text: 'Futuristik / Fiksi Ilmiah' }, { value: 'visualStyle.realistic', text: 'Realistis' }, { value: 'visualStyle.retro', text: 'Retro / Vintage' }, { value: 'visualStyle.warm', text: 'Hangat & Lembut' }, { value: 'visualStyle.gritty', text: 'Kasar / Gelap' }, { value: 'visualStyle.dreamlike', text: 'Seperti Mimpi' } ],
            sceneCount: [ { value: '0', text: 'Pilih Adegan' }, { value: '1', text: '1 Adegan' }, { value: '2', text: '2 Adegan' }, { value: '3', text: '3 Adegan' } ]
        },
        en: {
            videoType: [ { value: 'videoType.none', text: 'Select Video Type' }, { value: 'videoType.productAd', text: 'Product Ad' }, { value: 'videoType.shortFilm', text: 'Short Film' }, { value: 'videoType.cinematicReels', text: 'Cinematic Reels' }, { value: 'videoType.storytelling', text: 'Storytelling' }, { value: 'videoType.explainer', text: 'Explainer / Education' }, { value: 'videoType.trailer', text: 'Trailer / Teaser' }, { value: 'videoType.podcast', text: 'Podcast' }, { value: 'videoType.vlog', text: 'Vlog / Personal' }, { value: 'videoType.romantic', text: 'Romantic Story' } ],
            visualStyle: [ { value: 'visualStyle.none', text: 'Select Visual Style' }, { value: 'visualStyle.cinematic', text: 'Cinematic' }, { value: 'visualStyle.magical', text: 'Magical / Fantasy' }, { value: 'visualStyle.action', text: 'Action' }, { value: 'visualStyle.futuristic', text: 'Futuristic / Sci-Fi' }, { value: 'visualStyle.realistic', text: 'Realistic' }, { value: 'visualStyle.retro', text: 'Retro / Vintage' }, { value: 'visualStyle.warm', text: 'Warm & Soft' }, { value: 'visualStyle.gritty', text: 'Gritty / Dark' }, { value: 'visualStyle.dreamlike', text: 'Dreamlike' } ],
            sceneCount: [ { value: '0', text: 'Select Scenes' }, { value: '1', text: '1 Scene' }, { value: '2', text: '2 Scenes' }, { value: '3', text: '3 Scenes' } ]
        }
    };

    // --- DOM Selectors ---
    const DOMElements = {
        body: document.body,
        loginCard: document.getElementById('login-card'),
        generatorContent: document.getElementById('generator-content'),
        loginForm: document.getElementById('login-form'),
        passwordInput: document.getElementById('password') as HTMLInputElement,
        togglePassword: document.getElementById('toggle-password'),
        storyIdea: document.getElementById('story-idea') as HTMLTextAreaElement,
        videoType: document.getElementById('videoType') as HTMLSelectElement,
        visualStyle: document.getElementById('visualStyle') as HTMLSelectElement,
        sceneCount: document.getElementById('scene-count') as HTMLSelectElement,
        aiDirectorBtn: document.getElementById('ai-director-btn'),
        storyboardContainer: document.getElementById('storyboard-container'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        offcanvasMenu: document.getElementById('offcanvas-menu'),
        offcanvasBackdrop: document.getElementById('offcanvas-backdrop'),
        offcanvasCloseBtn: document.getElementById('offcanvas-close-btn'),
        historyModal: document.getElementById('history-modal'),
        apiKeyModal: document.getElementById('api-key-modal'),
        alertModal: document.getElementById('alert-modal'),
        confirmationModal: document.getElementById('confirmation-modal'),
        apiKeyInput: document.getElementById('api-key-input') as HTMLInputElement,
        allModals: document.querySelectorAll('.fixed.inset-0'),
        themeBtnDesktop: document.getElementById('theme-btn-desktop'),
        themeBtnMobile: document.getElementById('theme-btn-mobile'),
        langBtnDesktop: document.getElementById('lang-btn-desktop'),
        langBtnMobileIcon: document.getElementById('lang-btn-mobile-icon'),
        historyBtnMobileIcon: document.getElementById('history-btn-mobile-icon'),
        apiKeyBtnDesktop: document.getElementById('api-key-btn-desktop'),
        apiKeyBtnMobileIcon: document.getElementById('api-key-btn-mobile-icon'),
    };

    // --- UTILITY & HELPER FUNCTIONS ---
    const getUIText = (key: string, ...args: any[]) => {
        const translation = UI_STRINGS[AppState.currentLang][key];
        return typeof translation === 'function' ? translation(...args) : translation;
    };
    
    const openModal = (modal: HTMLElement) => {
        const content = modal.querySelector('.card, .panel') as HTMLElement;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        content.classList.remove('animate__zoomOut', 'animate__fadeOut');
        content.classList.add('animate__zoomIn', 'animate__faster');
    };

    const closeModal = (modal: HTMLElement) => {
        const content = modal.querySelector('.card, .panel') as HTMLElement;
        content.classList.remove('animate__zoomIn');
        content.classList.add('animate__zoomOut', 'animate__faster');
        const handleAnimationEnd = () => {
            modal.classList.add('hidden');
            content.removeEventListener('animationend', handleAnimationEnd);
        };
        content.addEventListener('animationend', handleAnimationEnd);
    };
    
    const showAlert = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        const typeMap = {
            success: { titleKey: 'alertSuccessTitle', icon: 'fa-check-circle', color: 'bg-[var(--theme-success)]', btn: 'btn-secondary' },
            error: { titleKey: 'alertErrorTitle', icon: 'fa-times-circle', color: 'bg-[var(--theme-error)]', btn: 'btn-danger' },
            info: { titleKey: 'alertInfoTitle', icon: 'fa-info-circle', color: 'bg-[var(--theme-accent-2)]', btn: 'btn-primary' }
        };
        const config = typeMap[type];

        document.getElementById('alert-title').textContent = getUIText(config.titleKey);
        document.getElementById('alert-message').textContent = message;
        document.getElementById('alert-icon-container').className = `w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${config.color}`;
        document.getElementById('alert-icon').className = `fas text-4xl text-white ${config.icon}`;
        const closeBtn = document.getElementById('alert-close-btn');
        closeBtn.textContent = getUIText('alertCloseButton');
        closeBtn.className = `btn mt-6 w-full ${config.btn}`;
        
        openModal(DOMElements.alertModal);
    };
    
    const showConfirmation = (titleKey: string, messageKey: string, onConfirm: () => void) => {
        document.getElementById('confirmation-title').textContent = getUIText(titleKey);
        document.getElementById('confirmation-message').textContent = getUIText(messageKey);
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        
        yesBtn.textContent = getUIText('confirmYes');
        noBtn.textContent = getUIText('confirmNo');

        const newYesBtn = yesBtn.cloneNode(true) as HTMLButtonElement;
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
        newYesBtn.onclick = () => {
            onConfirm();
            closeModal(DOMElements.confirmationModal);
        };
        openModal(DOMElements.confirmationModal);
    };

    // --- CORE APPLICATION LOGIC ---
    const applyTheme = (theme: 'dark' | 'light') => {
        AppState.currentTheme = theme;
        localStorage.setItem('promptique_theme', theme);
        
        const sunIcon = '<i class="fas fa-sun fa-fw text-lg"></i>';
        const moonIcon = '<i class="fas fa-moon fa-fw text-lg"></i>';

        if (theme === 'light') {
            DOMElements.body.classList.add('light-theme');
            DOMElements.themeBtnDesktop.innerHTML = sunIcon;
            DOMElements.themeBtnMobile.querySelector('i').className = 'fas fa-sun fa-fw text-lg w-6 text-center';
        } else {
            DOMElements.body.classList.remove('light-theme');
            DOMElements.themeBtnDesktop.innerHTML = moonIcon;
            DOMElements.themeBtnMobile.querySelector('i').className = 'fas fa-moon fa-fw text-lg w-6 text-center';
        }
        
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent-2').trim();
        const encodedColor = encodeURIComponent(accentColor);
        document.querySelectorAll('.form-select').forEach(el => {
            (el as HTMLElement).style.backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodedColor}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;
        });
    };
    
    const updateUI = () => {
        const lang = AppState.currentLang;
        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-ui-key]').forEach(el => {
            const key = (el as HTMLElement).dataset.uiKey;
            if (UI_STRINGS[lang][key]) el.textContent = getUIText(key);
        });
        
        document.querySelectorAll('[data-ui-key-placeholder]').forEach(el => {
            const key = (el as HTMLElement).dataset.uiKeyPlaceholder;
            if (UI_STRINGS[lang][key]) (el as HTMLInputElement).placeholder = getUIText(key);
        });

        document.querySelectorAll('[data-ui-key-title]').forEach(el => {
            const key = (el as HTMLElement).dataset.uiKeyTitle;
            if(UI_STRINGS[lang][key]) (el as HTMLElement).title = getUIText(key);
        });
        
        DOMElements.langBtnDesktop.querySelector('span').textContent = lang.toUpperCase();
        DOMElements.langBtnMobileIcon.querySelector('span').textContent = lang.toUpperCase();

        (['videoType', 'visualStyle', 'sceneCount'] as const).forEach(id => {
            const select = DOMElements[id];
            if (select) {
                const currentVal = select.value;
                select.innerHTML = DROPDOWN_OPTIONS[lang][id]
                    .map(opt => `<option value="${opt.value}">${opt.text}</option>`)
                    .join('');
                if (currentVal) select.value = currentVal;
            }
        });
        
        renderStoryboard();
    };

    const setLoginState = (loggedIn: boolean) => {
        AppState.isLoggedIn = loggedIn;
        if (loggedIn) {
            DOMElements.loginCard.classList.add('hidden');
            DOMElements.generatorContent.classList.remove('hidden');
        } else {
            DOMElements.loginCard.classList.remove('hidden');
            DOMElements.generatorContent.classList.add('hidden');
            sessionStorage.removeItem('promptique_session');
        }
    };

    async function callGeminiAPI(params: GenerateContentParameters) {
        const apiKeyToUse = AppState.personalApiKey || process.env.API_KEY;

        if (!apiKeyToUse) {
            showAlert('API Key is not configured. Please set a personal key in the API Key menu.', 'error');
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

        try {
            const response = await ai.models.generateContent(params);
            if (params.config?.responseMimeType === 'application/json') {
                const text = response.text.trim();
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1] || jsonMatch[2]);
                }
                try {
                    return JSON.parse(text);
                } catch (e) {
                     throw new Error("AI did not return valid JSON content.");
                }
            }
            return response.text;
        } catch(e) {
            console.error("Error calling Gemini API:", e);
            showAlert(`Failed to contact AI: ${e.message}`, 'error');
            return null;
        }
    }

    const renderStoryboard = () => {
        const container = DOMElements.storyboardContainer;
        container.innerHTML = '';
        if (!AppState.storyboardData) return;

        const { key_characters, scenes } = AppState.storyboardData;

        if (key_characters && key_characters.length > 0) {
            const charactersHtml = `
                <section id="key-characters-card" class="card p-6 animate__animated animate__fadeInUp animate__faster">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="flex items-center text-2xl font-bold gradient-text">
                            <i class="fas fa-users mr-3"></i>
                            <span>${getUIText('keyCharactersLabel')}</span>
                        </h3>
                    </div>
                    <div id="key-characters-content" class="space-y-4">
                        ${key_characters.map((char, index) => `
                            <div class="key-character-item" data-char-index="${index}">
                                <p class="font-semibold text-[var(--theme-text-primary)]">${char.identifier}</p>
                                <p class="description-text text-sm text-[var(--theme-text-secondary)]">${char.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
            container.insertAdjacentHTML('beforeend', charactersHtml);
        }

        scenes.forEach((scene, index) => {
            const sceneHtml = `
                <section id="scene-card-${index}" class="card p-6 animate__animated animate__fadeInUp animate__faster">
                    <div class="flex justify-between items-start mb-4 flex-wrap">
                         <div class="w-full md:w-auto">
                            <h3 class="text-2xl font-bold gradient-text">${getUIText('sceneLabel')} ${scene.scene_number}</h3>
                            <p class="text-sm text-[var(--theme-text-secondary)]">${scene.duration_seconds} ${getUIText('secondsUnit')}</p>
                         </div>
                         <div class="w-full md:w-auto flex items-center gap-2 mt-4 md:mt-0">
                             <button class="btn btn-neutral lang-toggle-btn text-sm py-1 px-3" data-scene-index="${index}">
                                 <span class="font-bold">${scene.currentLang === 'id' ? 'EN' : 'ID'}</span>
                             </button>
                             <button class="btn btn-secondary edit-scene-btn text-sm py-1 px-3" data-scene-index="${index}">
                                 <i class="fas fa-pencil-alt"></i><span>${getUIText('editButton')}</span>
                             </button>
                             <button class="btn btn-primary generate-prompts-btn text-sm py-2 px-4" data-scene-index="${index}">
                                <i class="fas fa-magic-sparkles"></i><span>${getUIText('generatePromptsButton')}</span>
                             </button>
                         </div>
                    </div>
                    <div class="scene-description-content space-y-2 text-sm">
                        <p data-desc-type="visual"><strong class="font-semibold text-[var(--theme-text-primary)]">Visual:</strong> <span class="text-[var(--theme-text-secondary)]">${scene.visual_description[scene.currentLang]}</span></p>
                        <p data-desc-type="camera"><strong class="font-semibold text-[var(--theme-text-primary)]">Kamera:</strong> <span class="text-[var(--theme-text-secondary)]">${scene.camera_shot[scene.currentLang]}</span></p>
                        <p data-desc-type="audio"><strong class="font-semibold text-[var(--theme-text-primary)]">Audio:</strong> <span class="text-[var(--theme-text-secondary)]">${scene.audio_description[scene.currentLang]}</span></p>
                    </div>
                    <div id="prompt-results-${index}" class="mt-4 pt-4 border-t border-[var(--theme-border)] space-y-4 hidden">
                        <!-- Prompt results will be injected here -->
                    </div>
                </section>
            `;
            container.insertAdjacentHTML('beforeend', sceneHtml);
        });
    };
    
    const getHistory = () => JSON.parse(localStorage.getItem('promptique_history')) || [];
    const saveHistory = (history: string[]) => localStorage.setItem('promptique_history', JSON.stringify(history));
    
    const renderHistory = () => {
        const history = getHistory();
        const contentEl = document.getElementById('history-content');
        contentEl.innerHTML = '';
        if (history.length === 0) {
            contentEl.innerHTML = `<div class="text-center text-[var(--theme-text-secondary)] py-10"><i class="fas fa-box-open fa-3x mb-4"></i><p>${getUIText('alertHistoryEmpty')}</p></div>`;
            return;
        }
        history.reverse().forEach(idea => {
            const historyItem = document.createElement('button');
            historyItem.className = 'w-full text-left p-3 rounded-lg bg-[var(--theme-panel-bg)] hover:bg-[var(--theme-border)]/20 transition-colors duration-200 truncate';
            historyItem.textContent = idea;
            historyItem.onclick = () => {
                DOMElements.storyIdea.value = idea;
                closeModal(DOMElements.historyModal);
                showAlert('Ide cerita dimuat dari riwayat.', 'info');
            };
            contentEl.appendChild(historyItem);
        });
    };

    const openOffCanvas = () => {
        const menu = DOMElements.offcanvasMenu;
        if (!menu) return;
        menu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            menu.classList.add('open');
        }, 10);
    };

    const closeOffCanvas = () => {
        const menu = DOMElements.offcanvasMenu;
        if (!menu) return;
        menu.classList.remove('open');
        document.body.style.overflow = '';
        const panel = menu.querySelector('#offcanvas-menu-panel');
        if (!panel) return;

        const onTransitionEnd = () => {
            menu.classList.add('hidden');
            panel.removeEventListener('transitionend', onTransitionEnd);
        };
        panel.addEventListener('transitionend', onTransitionEnd);
    };

    // --- EVENT HANDLERS ---
    const handleLogin = (e: Event) => {
        e.preventDefault();
        if (DOMElements.passwordInput.value === '1') {
            const now = new Date().getTime();
            const session = { loggedIn: true, timestamp: now };
            sessionStorage.setItem('promptique_session', JSON.stringify(session));
            setLoginState(true);
        } else {
            showAlert(getUIText('loginFailed'), 'error');
        }
    };

    const handleLogout = () => { showConfirmation('confirmLogoutTitle', 'confirmLogoutMessage', () => { setLoginState(false); showAlert(getUIText('alertLoggedOut'), 'success'); }); };
    const handleLanguageToggle = () => { AppState.currentLang = AppState.currentLang === 'id' ? 'en' : 'id'; localStorage.setItem('promptique_lang', AppState.currentLang); updateUI(); };
    const handleThemeToggle = () => { applyTheme(AppState.currentTheme === 'dark' ? 'light' : 'dark'); };

    const handleAIDirector = async () => {
        if (!DOMElements.storyIdea.value.trim()) { showAlert(getUIText('alertIdeaEmpty'), 'error'); return; }
        if (DOMElements.videoType.value === 'videoType.none') { showAlert(getUIText('alertVideoTypeEmpty'), 'error'); return; }
        if (DOMElements.visualStyle.value === 'visualStyle.none') { showAlert(getUIText('alertVisualStyleEmpty'), 'error'); return; }
        if (DOMElements.sceneCount.value === '0') { showAlert(getUIText('alertSceneCountEmpty'), 'error'); return; }

        const btn = DOMElements.aiDirectorBtn as HTMLButtonElement;
        btn.disabled = true;
        const btnText = btn.querySelector('#ai-btn-text');
        const loaderSpan = btn.querySelector('#ai-btn-loader');
        btnText.classList.add('hidden');
        const loaderText = AppState.personalApiKey ? getUIText('loaderUserAI') : getUIText('loaderSystemAI');
        loaderSpan.innerHTML = `<div class="flex items-center gap-2"><span class="loader"></span><span>${loaderText}</span></div>`;
        loaderSpan.classList.remove('hidden');

        const storyIdea = DOMElements.storyIdea.value.trim();
        
        // Step 1: Validate the story idea
        const validationSystemInstruction = `You are a strict story idea validator. Your task is to analyze the user's idea. If the idea is coherent, specific, and makes sense, you MUST respond with only the word 'OK'. If the idea is nonsensical, too abstract, gibberish, or violates safety policies, you MUST firmly but politely reject it. Explain the reason for rejection clearly and suggest what makes a good story idea. Respond in the user's language: ${AppState.currentLang}.`;
        
        const validationResult = await callGeminiAPI({
            model: 'gemini-2.5-flash',
            contents: storyIdea,
            config: {
                systemInstruction: validationSystemInstruction,
            }
        });

        if (validationResult?.trim() !== 'OK') {
            showAlert(validationResult || getUIText('alertIdeaIncoherent'), 'error');
            btn.disabled = false;
            btnText.classList.remove('hidden');
            loaderSpan.classList.add('hidden');
            return;
        }

        // Step 2: Generate the storyboard
        const videoTypeText = DOMElements.videoType.options[DOMElements.videoType.selectedIndex].text;
        const visualStyleText = DOMElements.visualStyle.options[DOMElements.visualStyle.selectedIndex].text;
        const sceneCount = DOMElements.sceneCount.value;

        const systemInstruction = "You are a professional storyboard artist and scriptwriter. Your task is to take a user's video concept and create a detailed storyboard plan with consistent characters/objects.\nFirst, carefully analyze the user's concept to identify the main recurring characters, subjects, or key objects and provide a detailed, consistent physical description for each to ensure visual consistency. If no clear recurring characters exist, this can be empty.\nSecond, break down the narrative into a specific number of connected scenes based on the user's request. Ensure the scenes flow logically if more than one is requested. Consider the user's requested video type and visual style. IMPORTANT: You must generate all descriptions (for both key_characters and scenes) in Indonesian.";
        let userPrompt = `Video Concept: "${storyIdea}"\nNumber of Scenes: ${sceneCount}`;
        if (videoTypeText && videoTypeText !== 'Pilih Jenis Video' && videoTypeText !== 'Select Video Type') userPrompt += `\nVideo Type: ${videoTypeText}`;
        if (visualStyleText && visualStyleText !== 'Pilih Gaya Visual' && visualStyleText !== 'Select Visual Style') userPrompt += `\nVisual Style: ${visualStyleText}`;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                key_characters: { type: Type.ARRAY, description: "List of main recurring characters, subjects, or key objects.", items: { type: Type.OBJECT, properties: { identifier: { type: Type.STRING, description: "A short, memorable name like 'The Detective' or 'The Antique Locket'." }, description: { type: Type.STRING, description: "A detailed, consistent physical description for visual consistency." } }, required: ["identifier", "description"] } },
                scenes: { type: Type.ARRAY, description: "A scene-by-scene storyboard.", items: { type: Type.OBJECT, properties: { scene_number: { type: Type.INTEGER, description: "The sequential number of the scene." }, visual_description: { type: Type.STRING, description: "A detailed description of the visuals in the scene. Must refer to characters/objects using their 'identifier'." }, camera_shot: { type: Type.STRING, description: "Description of the camera shot, angle, and movement." }, audio_description: { type: Type.STRING, description: "Description of the audio, including music, sound effects, and dialogue." } }, required: ["scene_number", "visual_description", "camera_shot", "audio_description"] } }
            },
            required: ["key_characters", "scenes"]
        };

        const generatedStoryboard = await callGeminiAPI({ 
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: schema 
            }
        });

        if (generatedStoryboard && generatedStoryboard.scenes) {
            const processedScenes = generatedStoryboard.scenes.map(scene => ({
                ...scene,
                duration_seconds: 8,
                visual_description: { id: scene.visual_description, en: null },
                camera_shot: { id: scene.camera_shot, en: null },
                audio_description: { id: scene.audio_description, en: null },
                currentLang: 'id' as 'id' | 'en'
            }));

            AppState.storyboardData = {
                ...generatedStoryboard,
                scenes: processedScenes
            };
            
            renderStoryboard();
            const history = getHistory();
            const uniqueHistory = new Set([storyIdea, ...history]);
            saveHistory(Array.from(uniqueHistory).slice(0, 20));
            showAlert(getUIText('alertGenerated'), 'success');
            DOMElements.storyboardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        btn.disabled = false;
        btnText.classList.remove('hidden');
        loaderSpan.classList.add('hidden');
    };
    
    const translateScene = async (sceneIndex: number, targetLang: 'id' | 'en') => {
        const scene = AppState.storyboardData.scenes[sceneIndex];
        const sourceLang = targetLang === 'en' ? 'id' : 'en';

        const contentToTranslate = {
            visual_description: scene.visual_description[sourceLang],
            camera_shot: scene.camera_shot[sourceLang],
            audio_description: scene.audio_description[sourceLang],
        };

        const systemInstruction = `You are a professional translator. Translate the values of the following JSON object into ${targetLang === 'en' ? 'English' : 'Indonesian'}. Maintain the exact JSON structure and keys. Only provide the translated JSON object as your response.`;
        const userPrompt = JSON.stringify(contentToTranslate);
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                visual_description: { type: Type.STRING },
                camera_shot: { type: Type.STRING },
                audio_description: { type: Type.STRING },
            },
            required: ["visual_description", "camera_shot", "audio_description"],
        };

        const translatedContent = await callGeminiAPI({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });

        return translatedContent;
    };

    const handleSceneContainerClick = async (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('button');
        if (!target) return;

        // Handle tab clicks FIRST, as they don't rely on sceneIndex.
        if (target.classList.contains('tab-btn')) {
            e.preventDefault();
            const sceneCard = target.closest('.card');
            const targetContentId = target.dataset.tabTarget;

            if (sceneCard && targetContentId) {
                sceneCard.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                sceneCard.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

                target.classList.add('active');
                const contentElement = document.getElementById(targetContentId);
                if (contentElement) {
                    contentElement.classList.remove('hidden');
                }
            }
            return; // Stop further execution for tab clicks.
        }
        
        const sceneIndexAttr = target.dataset.sceneIndex;
        if (!sceneIndexAttr) return;
        const sceneIndex = parseInt(sceneIndexAttr, 10);
        
        if (target.classList.contains('lang-toggle-btn')) {
            target.disabled = true;
            target.innerHTML = `<span class="loader-xs"></span>`;

            const scene = AppState.storyboardData.scenes[sceneIndex];
            const targetLang = scene.currentLang === 'id' ? 'en' : 'id';
            
            if (scene.visual_description[targetLang]) {
                scene.currentLang = targetLang;
                renderStoryboard();
            } else {
                const translated = await translateScene(sceneIndex, targetLang);
                if (translated) {
                    scene.visual_description[targetLang] = translated.visual_description;
                    scene.camera_shot[targetLang] = translated.camera_shot;
                    scene.audio_description[targetLang] = translated.audio_description;
                    scene.currentLang = targetLang;
                    showAlert(getUIText('alertSceneTranslated'), 'success');
                } else {
                    showAlert(getUIText('alertTranslationError'), 'error');
                }
                renderStoryboard();
            }
            return;
        }

        if (target.classList.contains('edit-scene-btn')) {
            const sceneCard = document.getElementById(`scene-card-${sceneIndex}`);
            const contentDiv = sceneCard.querySelector('.scene-description-content');
            const isEditing = target.dataset.editing === 'true';
            const scene = AppState.storyboardData.scenes[sceneIndex];
            const currentLang = scene.currentLang;

            if (isEditing) {
                const visualTextarea = contentDiv.querySelector('[data-desc-type="visual"] textarea') as HTMLTextAreaElement;
                const cameraTextarea = contentDiv.querySelector('[data-desc-type="camera"] textarea') as HTMLTextAreaElement;
                const audioTextarea = contentDiv.querySelector('[data-desc-type="audio"] textarea') as HTMLTextAreaElement;

                scene.visual_description[currentLang] = visualTextarea.value;
                scene.camera_shot[currentLang] = cameraTextarea.value;
                scene.audio_description[currentLang] = audioTextarea.value;

                const otherLang = currentLang === 'id' ? 'en' : 'id';
                scene.visual_description[otherLang] = null;
                scene.camera_shot[otherLang] = null;
                scene.audio_description[otherLang] = null;

                if (scene.generatedPrompts) {
                    delete scene.generatedPrompts;
                }

                renderStoryboard(); 
                showAlert(getUIText('alertSceneSaved'), 'success');

            } else {
                const descriptionElements = contentDiv.querySelectorAll('p[data-desc-type]');
                descriptionElements.forEach(p => {
                    const span = p.querySelector('span');
                    const currentText = span.textContent;
                    const textarea = document.createElement('textarea');
                    textarea.className = 'form-textarea text-sm w-full';
                    textarea.value = currentText;
                    span.replaceWith(textarea);
                });
                
                target.dataset.editing = 'true';
                target.innerHTML = `<i class="fas fa-save"></i><span>${getUIText('saveButton')}</span>`;
                sceneCard.querySelector('.generate-prompts-btn').classList.add('hidden');
                sceneCard.querySelector('.lang-toggle-btn').classList.add('hidden');
            }
            return;
        }

        if (target.classList.contains('generate-prompts-btn')) {
            const originalContent = target.innerHTML;
            target.innerHTML = `<span class="loader"></span>`;
            target.disabled = true;

            const scene = AppState.storyboardData.scenes[sceneIndex];
            const characters = AppState.storyboardData.key_characters;

            const visualDesc = scene.visual_description.en || scene.visual_description.id;
            const cameraShot = scene.camera_shot.en || scene.camera_shot.id;
            const audioDesc = scene.audio_description.en || scene.audio_description.id;

            const systemInstruction = "You are an expert prompt engineer for Google's generative AI models. Your task is to take a scene description from a storyboard and transform it into three distinct outputs for video generation, formatted as a JSON object.\n\n1. **'combinedPrompt'**: Create a comprehensive, narrative prompt for a text-to-video model. This prompt should combine all scene inputs into a flowing narrative, enriched with cinematic language. Structure this prompt into four sections:[Visual]:,[Camera Movement & Angle]:,[Audio]:, and[Mood & Additional Details]:.\n2. **'imagePrompt'**: Create a highly detailed, descriptive prompt for a text-to-image model for this specific scene. Focus on artistic style, lighting, composition, and intricate visual details.\n3. **'animationPrompt'**: Create a concise, action-oriented prompt to animate the image generated from 'imagePrompt'. This prompt should describe the movement, camera motion, evolution of the scene, AND all accompanying audio details for this scene.\n\nGenerate all prompts in English.";
            
            let userPrompt = characters.length > 0
                ? `Here are the key characters/objects for this story. Use their full descriptions whenever their identifier appears in the visual description to ensure consistency: ${characters.map(c => `- ${c.identifier}: ${c.description}`).join('\n')}\n\n`
                : "";
            userPrompt += `Please generate the prompt JSON for the following scene:\nScene Number: ${scene.scene_number}\nVisuals: ${visualDesc}\nCamera: ${cameraShot}\nAudio: ${audioDesc}\nEstimated Duration: ${scene.duration_seconds} seconds`;

            const promptSchema = {
                type: Type.OBJECT,
                properties: {
                    combinedPrompt: { type: Type.STRING, description: "The full, combined text-to-video prompt." },
                    imagePrompt: { type: Type.STRING, description: "The detailed prompt for generating the static base image." },
                    animationPrompt: { type: Type.STRING, description: "The concise prompt for animating the image and adding audio." },
                },
                required: ["combinedPrompt", "imagePrompt", "animationPrompt"],
            };

            const generatedPrompts = await callGeminiAPI({ 
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: promptSchema,
                    temperature: 0.8,
                    topP: 0.95
                }
            });
            
            if (generatedPrompts) {
                const resultsContainer = document.getElementById(`prompt-results-${sceneIndex}`);
                resultsContainer.innerHTML = `
                    <div class="prompt-tabs border-b border-[var(--theme-border)]">
                        <button class="tab-btn active" data-tab-target="tab-combined-${sceneIndex}">${getUIText('combinedPromptTab')}</button>
                        <button class="tab-btn" data-tab-target="tab-image-motion-${sceneIndex}">${getUIText('imageMotionPromptTab')}</button>
                    </div>
                    <div class="tab-content-container mt-4">
                        <div id="tab-combined-${sceneIndex}" class="tab-content space-y-4">
                             <p class="text-sm text-[var(--theme-text-secondary)]">${getUIText('combinedPromptDescription')}</p>
                             <div>
                                <textarea class="form-textarea text-xs h-32" readonly>${generatedPrompts.combinedPrompt}</textarea>
                                <button class="btn btn-primary copy-prompt-btn text-sm py-2 px-4 w-full mt-2" data-prompt-type="combinedPrompt" data-scene-index="${sceneIndex}">
                                    <i class="fas fa-copy"></i><span>${getUIText('copyCombinedPrompt', scene.scene_number)}</span>
                                </button>
                             </div>
                        </div>
                        <div id="tab-image-motion-${sceneIndex}" class="tab-content hidden space-y-6">
                            <p class="text-sm text-[var(--theme-text-secondary)]">${getUIText('imageMotionPromptDescription')}</p>
                            <div class="space-y-2">
                                <label class="form-label !mb-1 text-sm">${getUIText('imagePromptStepLabel')}</label>
                                <textarea class="form-textarea text-xs h-24" readonly>${generatedPrompts.imagePrompt}</textarea>
                                <button class="btn btn-secondary copy-prompt-btn text-xs py-1 px-3" data-prompt-type="imagePrompt" data-scene-index="${sceneIndex}">
                                    <i class="fas fa-copy"></i><span>${getUIText('copyImagePrompt')}</span>
                                </button>
                            </div>
                            <div class="space-y-2">
                                <label class="form-label !mb-1 text-sm">${getUIText('animationPromptStepLabel')}</label>
                                <textarea class="form-textarea text-xs h-24" readonly>${generatedPrompts.animationPrompt}</textarea>
                                <button class="btn btn-secondary copy-prompt-btn text-xs py-1 px-3" data-prompt-type="animationPrompt" data-scene-index="${sceneIndex}">
                                    <i class="fas fa-copy"></i><span>${getUIText('copyAnimationPrompt')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                resultsContainer.classList.remove('hidden');
                AppState.storyboardData.scenes[sceneIndex].generatedPrompts = generatedPrompts;
                const promptCount = Object.keys(generatedPrompts).filter(key => generatedPrompts[key]).length;
                showAlert(getUIText('alertPromptGenerated', promptCount), 'success');
            }

            target.innerHTML = originalContent;
            target.disabled = false;

        } else if (target.classList.contains('copy-prompt-btn')) {
            const promptType = target.dataset.promptType;
            const textToCopy = AppState.storyboardData.scenes[sceneIndex].generatedPrompts[promptType];
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => showAlert(getUIText('alertSceneCopied'), 'success'))
                    .catch(() => showAlert(getUIText('alertCopyFailed'), 'error'));
            }
        }
    };

    const checkLoginSession = () => {
        const sessionString = sessionStorage.getItem('promptique_session');
        if (!sessionString) { setLoginState(false); return; }
        const session = JSON.parse(sessionString);
        const now = new Date().getTime();
        if (now - session.timestamp > 24 * 60 * 60 * 1000) {
            sessionStorage.removeItem('promptique_session');
            setLoginState(false);
        } else {
            setLoginState(true);
        }
    };

    // --- INITIALIZATION ---
    const init = () => {
        DOMElements.loginForm.addEventListener('submit', handleLogin);
        DOMElements.aiDirectorBtn.addEventListener('click', handleAIDirector);
        DOMElements.storyboardContainer.addEventListener('click', handleSceneContainerClick);
        
        DOMElements.hamburgerBtn.addEventListener('click', openOffCanvas);
        DOMElements.offcanvasBackdrop.addEventListener('click', closeOffCanvas);
        DOMElements.offcanvasCloseBtn.addEventListener('click', closeOffCanvas);
        
        DOMElements.langBtnDesktop.addEventListener('click', handleLanguageToggle);
        DOMElements.langBtnMobileIcon.addEventListener('click', handleLanguageToggle);
        
        DOMElements.themeBtnDesktop.addEventListener('click', handleThemeToggle);
        DOMElements.themeBtnMobile.addEventListener('click', () => {
            handleThemeToggle();
            closeOffCanvas();
        });
        
        DOMElements.togglePassword.addEventListener('click', () => {
            const isPassword = DOMElements.passwordInput.type === 'password';
            DOMElements.passwordInput.type = isPassword ? 'text' : 'password';
            DOMElements.togglePassword.className = `fas ${isPassword ? 'fa-eye-slash' : 'fa-eye'} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]`;
        });

        document.getElementById('history-btn-desktop').addEventListener('click', () => { renderHistory(); openModal(DOMElements.historyModal); });
        DOMElements.historyBtnMobileIcon.addEventListener('click', () => { renderHistory(); openModal(DOMElements.historyModal); });
        DOMElements.apiKeyBtnDesktop.addEventListener('click', () => openModal(DOMElements.apiKeyModal));
        DOMElements.apiKeyBtnMobileIcon.addEventListener('click', () => openModal(DOMElements.apiKeyModal));
        
        document.getElementById('logout-btn-desktop').addEventListener('click', handleLogout);
        document.getElementById('logout-btn-mobile-menu').addEventListener('click', () => {
            handleLogout();
            closeOffCanvas();
        });

        DOMElements.allModals.forEach(modal => {
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal as HTMLElement); });
            modal.querySelector('.close-modal-btn')?.addEventListener('click', () => closeModal(modal as HTMLElement));
        });
        document.getElementById('alert-close-btn').addEventListener('click', () => closeModal(DOMElements.alertModal));
        document.getElementById('confirm-no-btn').addEventListener('click', () => closeModal(DOMElements.confirmationModal));

        document.getElementById('clear-history-btn').addEventListener('click', () => { saveHistory([]); renderHistory(); showAlert(getUIText('alertHistoryCleared'), 'info'); });
        
        document.getElementById('save-api-key-btn').addEventListener('click', () => {
            const key = DOMElements.apiKeyInput.value.trim();
            if (key) {
                localStorage.setItem('promptique_api_key', key);
                AppState.personalApiKey = key;
                showAlert(getUIText('alertApiKeySaved'), 'success');
                closeModal(DOMElements.apiKeyModal);
            } else {
                showAlert(getUIText('alertApiKeyEmpty'), 'error');
            }
        });
        document.getElementById('delete-api-key-btn').addEventListener('click', () => {
            localStorage.removeItem('promptique_api_key');
            DOMElements.apiKeyInput.value = '';
            AppState.personalApiKey = null;
            showAlert(getUIText('alertApiKeyDeleted'), 'info');
        });

        // Load initial state
        AppState.currentLang = (localStorage.getItem('promptique_lang') || 'id') as 'id' | 'en';
        AppState.personalApiKey = localStorage.getItem('promptique_api_key');
        if (AppState.personalApiKey) DOMElements.apiKeyInput.value = AppState.personalApiKey;
        
        const savedTheme = (localStorage.getItem('promptique_theme') || 'dark') as 'dark' | 'light';
        applyTheme(savedTheme);
        checkLoginSession();
        updateUI();
    };

    init();
});
