// ==UserScript==
// @name         YouTube Ultimate Ad Blocker with Adblock Detection Bypass
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Block YouTube ads (video, banner, and other ads) and bypass adblock detection mechanisms effectively
// @author       Godgaming
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const AD_SELECTORS = [
        'ytd-display-ad-renderer', 
        'ytd-promoted-video-renderer', 
        'ytd-popup-container', 
        'ytd-promoted-sparkles-text-search-renderer',
        '.ytp-ad-overlay-container',
        '.ytp-ad-module',
        '#masthead-ad',
        '.ytp-ad-player-overlay',
        'ytd-companion-slot-renderer',
        'ytd-banner-promo-renderer',
        'ytd-video-masthead-ad-advertiser-info-renderer' // Added more specific selectors
    ];

    const SKIP_BUTTON_SELECTOR = '.ytp-ad-skip-button';
    const MUTE_BUTTON_SELECTOR = '.ytp-ad-preview-slot .ytp-mute-button';

    // Utility function to remove elements based on selectors
    function removeElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                console.log(`Removing ad element: ${selector}`, element);
                element.remove();
            });
        });
    }

    // Function to handle ad skipping and muting
    function handleAdControls() {
        // Skip video ads
        const adSkipButton = document.querySelector(SKIP_BUTTON_SELECTOR);
        if (adSkipButton) {
            console.log('Clicking skip ad button');
            adSkipButton.click();
        }

        // Mute video ads
        const adMuteButton = document.querySelector(MUTE_BUTTON_SELECTOR);
        if (adMuteButton && !adMuteButton.classList.contains('ytp-button-muted')) {
            console.log('Muting ad');
            adMuteButton.click();
        }
    }

    // Main function to remove ads and handle controls
    function removeAds() {
        removeElements(AD_SELECTORS);
        handleAdControls();
    }

    // Mutation Observer function to watch for dynamic ad elements
    function observeAds() {
        const observer = new MutationObserver(() => removeAds());
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    // Function to bypass adblock detection
    function bypassAdblockDetection() {
        const antiAdblockSelectors = [
            '.adblock-warning', // Example selector for anti-adblock overlay
            '#adblock-detection', // Example selector for adblock detection script
            '[class*=adblock]', // Any class containing 'adblock'
            '[id*=adblock]' // Any ID containing 'adblock'
        ];
        
        removeElements(antiAdblockSelectors);
    }

    // Mutation Observer to watch for adblock detection elements
    function observeAdblockDetection() {
        const observer = new MutationObserver(() => bypassAdblockDetection());
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    // Initial actions
    document.addEventListener('DOMContentLoaded', (event) => {
        removeAds();
        observeAds();
        bypassAdblockDetection();
        observeAdblockDetection();
    });

    // Reload script periodically to handle page changes
    setInterval(() => {
        removeAds();
        bypassAdblockDetection();
    }, 1000);

})();
