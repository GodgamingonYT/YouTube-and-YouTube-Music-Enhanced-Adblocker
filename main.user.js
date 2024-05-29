// ==UserScript==
// @name         YouTube & YouTube Music Enhanced Ad Blocker
// @namespace    https://github.com/GodgamingonYT/YouTube-and-YouTube-Music-Enhanced-Adblocker/blob/main/main.user.js
// @version      1.8
// @description  Block ads and bypass YouTube Adblock detection efficiently
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
        #player-ads, .html5-ads, .ytp-ad-feedback-dialog, .ad-container-loaded, [id^="ad_block"],
        [class*="overlay-ad"], [class*="ad-block"], [class*="advertisement"], [class*="sponsored"],
        [id*="ad_block_container"], .html5-video-player[id*="ad"]
        {
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
    
    const adObserverCallback = (mutations) => {
        const adContainers = document.querySelectorAll(`
            .video-ads, .ytp-ad-module .ad-showing, .ytp-ad-player-overlay, .ytp-ad-overlay-container, 
            .ytmusic-player-bar .ytp-ad-thumbnail, #ad-container, .ytm-ad-module, [id^="ad_block"], 
            [class*="overlay-ad"], [class*="ad-block"], [class*="advertisement"], [class*="sponsored"], 
            [id*="ad_block_container"], .html5-video-player[id*="ad"]
        `);
        
        adContainers.forEach(adContainer => {
            if (adContainer) {
                adContainer.remove();
            }
        });

        const skipButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-overlay-close-button');
        skipButtons.forEach(button => {
            if (button && button.style.display !== 'none') {
                button.click();
            }
        });
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
                if (url.includes('ad') || url.includes('doubleclick.net') || url.includes('googlesyndication') || url.includes('googleadservices')) {
                    url = 'about:blank';
                }
                originalOpen.apply(xhr, arguments);
            };

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200 && this.responseURL.includes('/get_video_info')) {
                    let responseText = this.responseText;
                    if (responseText.includes('ad')) {
                    }
                }
            });

            return xhr;
        }

        window.XMLHttpRequest = newXHR;
    };

    const hideAdDetectOverlay = () => {
        const detectionOverlays = document.querySelectorAll('div[id*="adBlock"], div[class*="ad-block"]');
        detectionOverlays.forEach(overlay => {
            overlay.remove();
        });
    };

    const observeDetectionOverlay = () => {
        const observer = new MutationObserver(hideAdDetectOverlay);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    observeAdElements();
    hijackXHR();
    observeDetectionOverlay();
})()
