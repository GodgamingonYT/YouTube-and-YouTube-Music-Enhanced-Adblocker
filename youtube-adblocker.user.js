// ==UserScript==
// @name         YouTube Adblock usersceipt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block YouTube ads
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://music.youtube.com/*
// @match        *://www.youtube-nocookie.com/*
// @author.      Godgaming
// @updateURL    https://raw.githubusercontent.com/GodgamingonYT/YouTube-AdBlocker-userscript/main/youtube-adblocker.user.js
// @downloadURL  https://raw.githubusercontent.com/GodgamingonYT/YouTube-AdBlocker-userscript/main/youtube-adblocker.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function runBlockYoutube() {
        const allowedHostnames = [
            "www.youtube.com",
            "m.youtube.com",
            "music.youtube.com",
            "www.youtube-nocookie.com"
        ];

        if (!allowedHostnames.includes(window.location.hostname)) {
            return;
        }

        const hiddenCSS = {
            "www.youtube.com": [
                "#__ffYoutube1",
                "#__ffYoutube2",
                "#__ffYoutube3",
                "#__ffYoutube4",
                "#feed-pyv-container",
                "#feedmodule-PRO",
                "#homepage-chrome-side-promo",
                "#merch-shelf",
                "#offer-module",
                '#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',
                "#pla-shelf",
                "#premium-yva",
                "#promo-info",
                "#promo-list",
                "#promotion-shelf",
                "#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer",
                "#search-pva",
                "#shelf-pyv-container",
                "#video-masthead",
                "#watch-branded-actions",
                "#watch-buy-urls",
                "#watch-channel-brand-div",
                "#watch7-branded-banner",
                "#YtKevlarVisibilityIdentifier",
                "#YtSparklesVisibilityIdentifier",
                ".carousel-offer-url-container",
                ".companion-ad-container",
                ".GoogleActiveViewElement",
                '.list-view[style="margin: 7px 0pt;"]',
                ".promoted-sparkles-text-search-root-container",
                ".promoted-videos",
                ".searchView.list-view",
                ".sparkles-light-cta",
                ".watch-extra-info-column",
                ".watch-extra-info-right",
                ".ytd-carousel-ad-renderer",
                ".ytd-compact-promoted-video-renderer",
                ".ytd-companion-slot-renderer",
                ".ytd-merch-shelf-renderer",
                ".ytd-player-legacy-desktop-watch-ads-renderer",
                ".ytd-promoted-sparkles-text-search-renderer",
                ".ytd-promoted-video-renderer",
                ".ytd-search-pyv-renderer",
                ".ytd-video-masthead-ad-v3-renderer",
                ".ytp-ad-action-interstitial-background-container",
                ".ytp-ad-action-interstitial-slot",
                ".ytp-ad-image-overlay",
                ".ytp-ad-overlay-container",
                ".ytp-ad-progress",
                ".ytp-ad-progress-list",
                '[class*="ytd-display-ad-"]',
                '[layout*="display-ad-"]',
                'a[href^="http://www.youtube.com/cthru?"]',
                'a[href^="https://www.youtube.com/cthru?"]',
                "ytd-action-companion-ad-renderer",
                "ytd-banner-promo-renderer",
                "ytd-compact-promoted-video-renderer",
                "ytd-companion-slot-renderer",
                "ytd-display-ad-renderer",
                "ytd-promoted-sparkles-text-search-renderer",
                "ytd-promoted-sparkles-web-renderer",
                "ytd-search-pyv-renderer",
                "ytd-single-option-survey-renderer",
                "ytd-video-masthead-ad-advertiser-info-renderer",
                "ytd-video-masthead-ad-v3-renderer",
                "YTM-PROMOTED-VIDEO-RENDERER"
            ],
            "m.youtube.com": [
                ".companion-ad-container",
                ".ytp-ad-action-interstitial",
                '.ytp-cued-thumbnail-overlay > div[style*="/sddefault.jpg"]',
                `a[href^="/watch?v="][onclick^="return koya.onEvent(arguments[0]||window.event,'"]:not([role]):not([class]):not([id])`,
                `a[onclick*='"ping_url":"http://www.google.com/aclk?']`,
                "ytm-companion-ad-renderer",
                "ytm-companion-slot",
                "ytm-promoted-sparkles-text-search-renderer",
                "ytm-promoted-sparkles-web-renderer",
                "ytm-promoted-video-renderer"
            ]
        };

        const hideElements = (hostname) => {
            const selectors = hiddenCSS[hostname];
            if (!selectors) {
                return;
            }
            const rule = `${selectors.join(", ")} { display: none!important; }`;
            const style = document.createElement("style");
            style.innerHTML = rule;
            document.head.appendChild(style);
        };

        const observeDomChanges = (callback) => {
            const domMutationObserver = new MutationObserver((mutations) => {
                callback(mutations);
            });
            domMutationObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        };

        const hideDynamicAds = () => {
            const elements = document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");
            if (elements.length === 0) {
                return;
            }
            elements.forEach((el) => {
                if (el.parentNode && el.parentNode.parentNode) {
                    const parent = el.parentNode.parentNode;
                    if (parent.localName === "ytd-rich-item-renderer") {
                        parent.style.display = "none";
                    }
                }
            });
        };

        const autoSkipAds = () => {
            if (document.querySelector(".ad-showing")) {
                const video = document.querySelector("video");
                if (video && video.duration) {
                    video.currentTime = video.duration;
                    setTimeout(() => {
                        const skipBtn = document.querySelector("button.ytp-ad-skip-button");
                        if (skipBtn) {
                            skipBtn.click();
                        }
                    }, 100);
                }
            }
        };

        const overrideObject = (obj, propertyName, overrideValue) => {
            if (!obj) {
                return false;
            }
            let overriden = false;
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && key === propertyName) {
                    obj[key] = overrideValue;
                    overriden = true;
                } else if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
                    if (overrideObject(obj[key], propertyName, overrideValue)) {
                        overriden = true;
                    }
                }
            }
            if (overriden) {
                console.log(`found: ${propertyName}`);
            }
            return overriden;
        };

        const jsonOverride = (propertyName, overrideValue) => {
            const nativeJSONParse = JSON.parse;
            JSON.parse = (...args) => {
                const obj = nativeJSONParse.apply(this, args);
                overrideObject(obj, propertyName, overrideValue);
                return obj;
            };
            const nativeResponseJson = Response.prototype.json;
            Response.prototype.json = new Proxy(nativeResponseJson, {
                apply(...args) {
                    const promise = Reflect.apply(args);
                    return new Promise((resolve, reject) => {
                        promise.then((data) => {
                            overrideObject(data, propertyName, overrideValue);
                            resolve(data);
                        }).catch((error) => reject(error));
                    });
                }
            });
        };

        jsonOverride("adPlacements", []);
        jsonOverride("playerAds", []);
        hideElements(window.location.hostname);
        hideDynamicAds();
        autoSkipAds();
        observeDomChanges(() => {
            hideDynamicAds();
            autoSkipAds();
        });
    }

    const script = document.createElement("script");
    const scriptText = runBlockYoutube.toString();
    script.innerHTML = `(${scriptText})();`;
    document.head.appendChild(script);
    document.head.removeChild(script);
})();
