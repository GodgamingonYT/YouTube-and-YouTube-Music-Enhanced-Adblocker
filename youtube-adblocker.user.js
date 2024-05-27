// ==UserScript==
// @name         YouTube & YouTube Music Ad Blocker Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Block ads on both YouTube and YouTube Music efficiently, bypassing AdBlock detection and inspired by AdGuard techniques.
// @author       Godgaming
// @match        *://*.youtube.com/*
// @match        *://music.youtube.com/*
// @downloadURL  https://raw.githubusercontent.com/GodgamingonYT/YouTube-AdBlocker-userscript/main/youtube-adblocker.user.js
// @updateURL    https://raw.githubusercontent.com/GodgamingonYT/YouTube-AdBlocker-userscript/main/youtube-adblocker.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const addStylesToHead = () => {
        const adBlockCSS = `
            .video-ads, .ytp-ad-module, .ytp-ad-player-overlay, .ytp-ad-overlay-container,
            .ytp-ad-image-overlay, .ytp-ad-skip-button, .ytp-ad-progress, .ytp-ad-marker-container,
            .ytp-ad-markers, .ad-showing, .ad-interrupting, .ad-created, .ad-display,
            .ytp-ad-preview-container, .ytp-ad-overlay-slot, .ytp-ad-overlay-background,
            .ytp-ad-overlay-image, .ytp-ad-overlay-close-button, .ytp-ad-overlay-container,
            .ytmusic-player-bar .ytp-ad-thumbnail {
                display: none !important;
            }
        `;

        const style = document.createElement('style');
        style.innerHTML = adBlockCSS;
        document.head.appendChild(style);
    };

    const adObserverCallback = (mutations) => {
        const adContainers = document.querySelectorAll('.video-ads, .ytp-ad-module .ad-showing, .ytp-ad-player-overlay, .ytp-ad-overlay-container, .ytmusic-player-bar .ytp-ad-thumbnail');
        
        adContainers.forEach(adContainer => {
            if (adContainer) {
                adContainer.style.display = 'none';
                adContainer.innerHTML = '';
            }
        });

        const skipButton = document.querySelector('.ytp-ad-skip-button');
        if (skipButton && skipButton.style.display !== 'none') {
            skipButton.click();
        }
    };

    const observeAdElements = () => {
        const observer = new MutationObserver(adObserverCallback);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const hijackXHR = () => {
        const originalXHR = window.XMLHttpRequest;
        
        function newXHR() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function (method, url) {
                if (url.includes('ad') || url.includes('doubleclick.net') || url.includes('googlesyndication')) {
                    url = 'about:blank';
                }
                originalOpen.apply(xhr, arguments);
            };
            
            return xhr;
        }
        
        window.XMLHttpRequest = newXHR;
    };

    const disableAdPlaybackErrorReporting = () => {
        window.onerror = (event) => {
            if (event.includes('ytp-ad-module')) {
                return true; // Suppress ad-related errors
            }
            return false;
        };
    };

    addStylesToHead();
    observeAdElements();
    hijackXHR();
    disableAdPlaybackErrorReporting();
})();
