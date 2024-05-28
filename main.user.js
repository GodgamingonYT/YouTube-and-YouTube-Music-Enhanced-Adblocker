// ==UserScript==
// @name         YouTube & YouTube Music Enhanced Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Block ads and bypass YouTube Adblock detection efficiently. Also removes ad spaces.
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

    const adBlockCSS = `
        .video-ads, .ytp-ad-module, .ytp-ad-player-overlay, .ytp-ad-overlay-container,
        .ytp-ad-image-overlay, .ytp-ad-skip-button, .ytp-ad-progress, .ytp-ad-marker-container,
        .ytp-ad-markers, .ad-showing, .ad-interrupting, .ad-created, .ad-display,
        .ytp-ad-preview-container, .ytp-ad-overlay-slot, .ytp-ad-overlay-background,
        .ytp-ad-overlay-image, .ytp-ad-overlay-close-button, .ytp-ad-overlay-container,
        .ytmusic-player-bar .ytp-ad-thumbnail, #ad-container, .ytm-ad-module, div[class*='ad-container'],
        #player-ads, .html5-ads, .ytp-ad-feedback-dialog, .ad-container-loaded {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .ytp-ad-module, .ytp-ad-player-overlay, #secondary[ytd-watch-flexy][is-two-columns], 
        .ytp-ad-text-overlay, .ytp-ad-message-container, .ytp-player-content.ad-interrupting {
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `;

    const style = document.createElement('style');
    style.innerHTML = adBlockCSS;
    document.head.appendChild(style);

    const adObserverCallback = () => {
        const elementsToCheck = [
            '.video-ads',
            '.ytp-ad-module',
            '.ad-showing',
            '.ytp-ad-player-overlay',
            '.ytp-ad-overlay-container',
            '.ytmusic-player-bar .ytp-ad-thumbnail',
            '#ad-container',
            '.ytm-ad-module'
        ];

        elementsToCheck.forEach(selector => {
            document.querySelectorAll(selector).forEach(adContainer => {
                if (adContainer) {
                    adContainer.style.display = 'none';
                    adContainer.innerHTML = '';
                    adContainer.style.width = '0';
                    adContainer.style.height = '0';
                    adContainer.style.margin = '0';
                    adContainer.style.padding = '0';
                }
            });
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
        const OriginalXHR = window.XMLHttpRequest;
        
        function newXHR() {
            const xhr = new OriginalXHR();
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

    const hideAdDetectOverlay = () => {
        const detectionOverlays = document.querySelectorAll('div[id*="adBlocker"]');
        detectionOverlays.forEach(detectionOverlay => {
            if (detectionOverlay) {
                detectionOverlay.style.display = 'none';
            }
        });
    };

    const observeDetectionOverlay = () => {
        const observer = new MutationObserver(hideAdDetectOverlay);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    document.addEventListener('DOMContentLoaded', () => {
        observeAdElements();
        hijackXHR();
        observeDetectionOverlay();
    });
})();