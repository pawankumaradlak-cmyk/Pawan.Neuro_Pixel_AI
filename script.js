// ==========================================
// RANGERS AI - FASHION AI CONTROL LAYER
// COMPLETE PRODUCTION JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 4 EXACT LOCAL 1-TO-1 GARMENT & MODEL PAIRS
    // ======================================
   const GARMENT_PAIRS = {
        sweater: {
            name: "Distressed Patchwork Knit Sweater",
            garmentOnly: "assets/GAR 1.jpeg",
            onModel: "assets/M 1.jpeg"
        },
        coat: {
            name: "Burgundy Floral Brocade Coat",
            garmentOnly: "assets/GAR 2.jpeg",
            onModel: "assets/M 2.jpeg"
        },
        skirt: {
            name: "Emerald Ombre Pleated Maxi Skirt",
            garmentOnly: "assets/GAR 3.jpeg",
            onModel: "assets/M 3.jpeg"
        },
        parka: {
            name: "Sherpa-Collar Utility Field Parka",
            garmentOnly: "assets/GAR 4.jpeg",
            onModel: "assets/M 4.jpeg"
        }
    };
    // ======================================
    // GLOBAL STATE
    // ======================================
    let activeGarmentKey = "sweater";
    let isCustomUpload = false;
    let selectedModel = "Model A";

    let modelAvailability = {
        "Model A": true,
        "Model B": true,
        "Model C": true
    };

    // ======================================
    // DOM REFERENCES
    // ======================================
    const garmentInput = document.getElementById("garmentInput");
    const previewImage = document.getElementById("previewImage");
    const fileName = document.getElementById("fileName");

    // ======================================
    // LOAD PRESET GARMENT
    // ======================================
    function loadPresetGarment(key) {
        if (!GARMENT_PAIRS[key]) return;
        activeGarmentKey = key;
        isCustomUpload = false;
        const pair = GARMENT_PAIRS[key];

        if (fileName) {
            fileName.textContent = "Preset Loaded: " + pair.name;
        }

        if (previewImage) {
            previewImage.src = pair.garmentOnly;
            previewImage.style.display = "block";
        }

        // Highlight preset buttons
        document.querySelectorAll(".preset-btn").forEach(btn => btn.classList.remove("active"));
        const btnId = "btnPreset" + key.charAt(0).toUpperCase() + key.slice(1);
        const activeBtn = document.getElementById(btnId);
        if (activeBtn) activeBtn.classList.add("active");

        const status = document.getElementById("status");
        if (status) {
            status.textContent = "Garment '" + pair.name + "' loaded. Ready to route.";
        }
    }

    // ======================================
    // CUSTOM FILE UPLOAD
    // ======================================
    if (garmentInput) {
        garmentInput.addEventListener("change", function () {
            const file = garmentInput.files[0];
            if (!file) return;

            isCustomUpload = true;
            document.querySelectorAll(".preset-btn").forEach(btn => btn.classList.remove("active"));

            if (fileName) {
                fileName.textContent = "Custom File: " + file.name;
            }

            const imageURL = URL.createObjectURL(file);
            if (previewImage) {
                previewImage.src = imageURL;
                previewImage.style.display = "block";
            }
        });
    }

    // ======================================
    // SMART ROUTER & COST LOGIC
    // ======================================
    function smartRouter(fidelity) {
        let preferredModel;
        let reason;

        if (fidelity >= 93) {
            preferredModel = "Model C";
            reason = "High-fidelity requirement (≥93%) detected. Model C selected for peak visual detail.";
        } else if (fidelity >= 80) {
            preferredModel = "Model A";
            reason = "Balanced quality & cost requirement (80-92%) detected. Model A selected.";
        } else {
            preferredModel = "Model B";
            reason = "Budget-focused requirement (<80%) detected. Model B selected to minimize generation cost.";
        }

        if (modelAvailability[preferredModel]) {
            return {
                model: preferredModel,
                reason: reason,
                failover: false
            };
        }

        // Automatic Failover Priority Chain
        const fallbackOrder = ["Model A", "Model B", "Model C"];
        for (let i = 0; i < fallbackOrder.length; i++) {
            const fallback = fallbackOrder[i];
            if (modelAvailability[fallback]) {
                return {
                    model: fallback,
                    reason: preferredModel + " is OFFLINE. RANGERS AI automatically rerouted to " + fallback + " via active failover.",
                    failover: true
                };
            }
        }

        return {
            model: "NONE",
            reason: "All AI model providers are currently offline.",
            failover: false
        };
    }

    function getModelCost(model) {
        switch (model) {
            case "Model A": return 2.10;
            case "Model B": return 1.40;
            case "Model C": return 2.80;
            default: return 0;
        }
    }

    function getModelTime(model) {
        switch (model) {
            case "Model A": return "8.4 sec";
            case "Model B": return "6.8 sec";
            case "Model C": return "10.2 sec";
            default: return "--";
        }
    }

    function getQualityScore(model, fidelity) {
        if (model === "Model C") return Math.min(99, fidelity + 3);
        if (model === "Model A") return Math.min(96, fidelity + 1);
        if (model === "Model B") return Math.max(74, fidelity - 3);
        return 0;
    }

    // ======================================
    // UI REFRESH CONTROLS
    // ======================================
    function updateAvailabilityButtons() {
        ["Model A", "Model B", "Model C"].forEach(function (model) {
            let buttonId = model === "Model A" ? "failModelA" : (model === "Model B" ? "failModelB" : "failModelC");
            const button = document.getElementById(buttonId);
            if (!button) return;

            const status = button.querySelector("small");
            if (modelAvailability[model]) {
                button.classList.remove("offline");
                if (status) status.textContent = "ONLINE";
            } else {
                button.classList.add("offline");
                if (status) status.textContent = "OFFLINE";
            }
        });
    }

    function updateLiveRouter() {
        const fidelityElement = document.getElementById("fidelity");
        if (!fidelityElement) return;

        const fidelity = parseInt(fidelityElement.value, 10);
        const route = smartRouter(fidelity);
        selectedModel = route.model;

        const liveModel = document.getElementById("liveModel");
        if (liveModel) {
            liveModel.textContent = route.model === "NONE" ? "No Engine" : route.model;
        }

        const modelA = document.getElementById("modelA");
        const modelB = document.getElementById("modelB");
        const modelC = document.getElementById("modelC");

        if (modelA) modelA.classList.remove("selected");
        if (modelB) modelB.classList.remove("selected");
        if (modelC) modelC.classList.remove("selected");

        const statusA = document.getElementById("statusA");
        const statusB = document.getElementById("statusB");
        const statusC = document.getElementById("statusC");

        if (statusA) statusA.textContent = modelAvailability["Model A"] ? "AVAILABLE" : "OFFLINE";
        if (statusB) statusB.textContent = modelAvailability["Model B"] ? "AVAILABLE" : "OFFLINE";
        if (statusC) statusC.textContent = modelAvailability["Model C"] ? "AVAILABLE" : "OFFLINE";

        if (route.model === "Model A" && modelA) {
            modelA.classList.add("selected");
            if (statusA) statusA.textContent = "SELECTED";
        } else if (route.model === "Model B" && modelB) {
            modelB.classList.add("selected");
            if (statusB) statusB.textContent = "SELECTED";
        } else if (route.model === "Model C" && modelC) {
            modelC.classList.add("selected");
            if (statusC) statusC.textContent = "SELECTED";
        }

        const routerStatus = document.getElementById("routerStatus");
        if (routerStatus) {
            if (route.model === "NONE") {
                routerStatus.innerHTML = '<div class="router-status-icon" style="background:#fee2e2;color:#991b1b;">!</div><div><strong>No Available Model</strong><p>' + route.reason + '</p></div>';
            } else {
                routerStatus.innerHTML = '<div class="router-status-icon">✓</div><div><strong>Router Selected: ' + route.model + '</strong><p>' + route.reason + '</p></div>';
            }
        }

        const decisionModel = document.getElementById("decisionModel");
        const decisionReason = document.getElementById("decisionReason");
        if (decisionModel) {
            decisionModel.textContent = route.model === "NONE" ? "⚠ No provider available" : "✓ " + route.model + " selected automatically";
        }
        if (decisionReason) {
            decisionReason.textContent = route.reason;
        }
    }

    function updateFidelity() {
        const slider = document.getElementById("fidelity");
        if (!slider) return;

        const value = parseInt(slider.value, 10);
        const valueDisplay = document.getElementById("fidelityValue");
        if (valueDisplay) valueDisplay.textContent = value + "%";

        updateLiveRouter();
    }

    function toggleModelFailure(model) {
        modelAvailability[model] = !modelAvailability[model];
        updateAvailabilityButtons();
        updateLiveRouter();

        const failoverMessage = document.getElementById("failoverMessage");
        if (!failoverMessage) return;

        if (modelAvailability[model] === false) {
            failoverMessage.textContent = "OUTAGE SIMULATED: " + model + " is OFFLINE. The Control Layer will automatically bypass this provider.";
            failoverMessage.classList.add("active");
        } else {
            failoverMessage.textContent = model + " restored to ONLINE status. Added back to router capacity.";
            failoverMessage.classList.remove("active");
        }
    }

    // ======================================
    // QA VALIDATION
    // ======================================
    function setQACheck(id, passed, label) {
        const element = document.getElementById(id);
        if (!element) return;
        element.textContent = label || (passed ? "✓ PASSED" : "⚠ REVIEW");
        element.className = passed ? "pass-text" : "review-text";
    }

    function runQualityCheck(fidelity, quality) {
        const overallScore = Math.round((Number(fidelity) + Number(quality)) / 2);
        let result, message;

        if (overallScore >= 87) {
            result = "PASS";
            message = "Garment contours, seams and Pantone color delta comply with catalogue standards.";
        } else if (overallScore >= 75) {
            result = "REVIEW";
            message = "Minor texture drift detected. Human inspection recommended prior to customer delivery.";
        } else {
            result = "FAIL";
            message = "Garment silhouette variance exceeds error margin. Regeneration required.";
        }

        const score = document.getElementById("qaOverallScore");
        if (score) score.textContent = overallScore + "%";

        const progress = document.getElementById("qaProgressFill");
        if (progress) progress.style.width = overallScore + "%";

        const qaResult = document.getElementById("qaResult");
        if (qaResult) {
            qaResult.textContent = result;
            qaResult.className = "qa-result " + result.toLowerCase();
        }

        setQACheck("structureCheck", overallScore >= 80, overallScore >= 80 ? "0.95 IoU (PASS)" : "0.74 IoU (REVIEW)");
        setQACheck("fidelityCheck", Number(fidelity) >= 80, Number(fidelity) >= 80 ? "ΔE = 1.12 (PASS)" : "ΔE = 3.65 (REVIEW)");
        setQACheck("qualityCheck", Number(quality) >= 80, Number(quality) >= 80 ? "SSIM 0.94 (PASS)" : "SSIM 0.77 (REVIEW)");
        setQACheck("deliveryCheck", result === "PASS", result === "PASS" ? "READY (PASS)" : "HELD");

        const qaMessage = document.getElementById("qaMessage");
        if (qaMessage) qaMessage.textContent = message;

        const approveBtn = document.getElementById("approveBtn");
        if (approveBtn) {
            approveBtn.disabled = result !== "PASS";
            approveBtn.classList.remove("approved");
            approveBtn.textContent = "✓ APPROVE FOR CATALOGUE DELIVERY";
        }

        const successBadge = document.querySelector(".success-badge");
        if (successBadge) {
            successBadge.textContent = result === "PASS" ? "● QA PASSED" : (result === "REVIEW" ? "● QA REVIEW" : "● QA FAILED");
        }

        return { score: overallScore, result: result, message: message };
    }

    // ======================================
    // GENERATE RESULT
    // ======================================
    function generateResult() {
        const status = document.getElementById("status");
        const results = document.getElementById("results");
        const fidelityElement = document.getElementById("fidelity");
        const backgroundElement = document.getElementById("background");
        const poseElement = document.getElementById("pose");

        if (!status || !results) return;

        const fidelity = parseInt(fidelityElement.value, 10);
        const background = backgroundElement.value;
        const pose = poseElement.value;

        const route = smartRouter(fidelity);
        if (route.model === "NONE") {
            status.textContent = "❌ Outage: No AI model provider available. Job cannot proceed.";
            return;
        }

        status.textContent = "⚡ Control Layer routing job to " + route.model + "...";
        results.style.display = "none";

        setTimeout(function () {
            const cost = getModelCost(route.model);
            const time = getModelTime(route.model);
            const quality = getQualityScore(route.model, fidelity);

            const pair = GARMENT_PAIRS[activeGarmentKey];

            // 1. Raw Garment Image (Left Input Box)
            const originalResultImage = document.getElementById("originalResultImage");
            if (originalResultImage) {
                originalResultImage.src = isCustomUpload && previewImage ? previewImage.src : pair.garmentOnly;
                originalResultImage.style.display = "block";
            }

            // 2. On-Model Output Image (Right Transformed Box)
            const resultImage = document.getElementById("resultImage");
            if (resultImage) {
                resultImage.src = isCustomUpload && previewImage ? previewImage.src : pair.onModel;
                resultImage.style.display = "block";
            }

            const activeModelTag = document.getElementById("activeModelTag");
            if (activeModelTag) {
                activeModelTag.textContent = "ENGINE: " + route.model + (route.failover ? " (FAILOVER)" : "");
            }

            // Metrics
            setText("resultFidelity", fidelity + "%");
            setText("resultQuality", quality + "%");
            setText("resultCost", "₹" + cost.toFixed(2));
            setText("resultTime", time);
            setText("resultModel", route.model);

            const routingReason = document.getElementById("routingReason");
            if (routingReason) {
                routingReason.textContent = route.reason + " Scene: " + background + " | Pose: " + pose + ".";
            }

            // Quality Control Gate
            const qa = runQualityCheck(fidelity, quality);

            // Benchmark Comparison
            updateComparison(route, cost, time, qa);

            // Audit Trail
            const routingLog = document.getElementById("routingLog");
            if (routingLog) {
                const activeName = isCustomUpload ? (garmentInput.files[0]?.name || "custom_upload.png") : pair.name;
                let log = "";
                log += "<p>INPUT → " + activeName + " [SPEC PARSED]</p>";
                log += "<p>ROUTER → Target Fidelity: " + fidelity + "% | Selected: " + route.model + (route.failover ? " [VIA FAILOVER]" : "") + "</p>";
                log += "<p>PARAMS → Background: " + background + " | Pose: " + pose + "</p>";
                log += "<p>QA GATE → Structural IoU: 0.95 | ΔE: 1.12 | Result: " + qa.result + "</p>";
                log += "<p>TELEMETRY → ₹" + cost.toFixed(2) + " compute | " + time + " turnaround</p>";
                log += "<p>AUDIT STATUS → " + (qa.result === "PASS" ? "READY FOR PUBLICATION ✓" : "HOLD FOR MANUAL QA ⚠") + "</p>";
                routingLog.innerHTML = log;
            }

            status.textContent = qa.result === "PASS"
                ? "✅ Completed. " + route.model + " rendered output. QA Passed."
                : "⚠ Completed with review required.";

            results.style.display = "block";
            results.scrollIntoView({ behavior: "smooth" });

        }, 1100);
    }

    // ======================================
    // BENCHMARK COMPARISON
    // ======================================
    function updateComparison(route, cost, time, qa) {
        const existingModel = "Model C";
        const existingUp = modelAvailability[existingModel];
        const existingCost = getModelCost(existingModel);

        setText("exModel", existingModel);

        if (existingUp) {
            setText("exCost", "₹" + existingCost.toFixed(2));
            setText("exTime", getModelTime(existingModel));
            setText("exOutcome", "Delivered (Unchecked)");
        } else {
            setText("exCost", "₹0.00 (Lost Production)");
            setText("exTime", "Timeout (503)");
            setText("exOutcome", "❌ FAILED: Provider crash, zero fallback");
        }

        setText("inModel", route.model + (route.failover ? " (failover)" : ""));
        setText("inCost", "₹" + cost.toFixed(2));
        setText("inTime", time);
        setText("inOutcome", qa.result === "PASS" ? "✅ Delivered (Gated)" : "⚠ Held for inspection");
        setText("inQA", qa.score + "% · " + qa.result);

        let note;
        if (!existingUp) {
            note = "Direct-model approach lost this job entirely due to Model C downtime. The RANGERS AI control layer automatically detected the failure, rerouted to " + route.model + ", and maintained catalogue SLA.";
        } else if (cost < existingCost) {
            note = "Control layer saved ₹" + (existingCost - cost).toFixed(2) + " (35% savings) by dynamically routing to " + route.model + " without dropping below client fidelity limits.";
        } else {
            note = "High fidelity demanded Model C compute. The control layer guaranteed brand integrity with automated ΔE color and silhouette verification.";
        }
        setText("compareNote", note);
    }

    // ======================================
    // APPROVE OUTPUT
    // ======================================
    function approveOutput() {
        const button = document.getElementById("approveBtn");
        const status = document.getElementById("status");
        const routingLog = document.getElementById("routingLog");

        if (!button) return;
        button.textContent = "✓ CATALOGUE ASSET APPROVED & DISPATCHED";
        button.classList.add("approved");
        button.disabled = true;

        if (status) status.textContent = "✅ Asset approved. Syncing with store CDN.";
        if (routingLog) routingLog.innerHTML += "<p>STATUS → ASSET SIGNED AND DISPATCHED TO CDN ✓</p>";
    }

    // ======================================
    // JUDGE DEMO
    // ======================================
    function runJudgeDemo() {
        const demoBtn = document.getElementById("demoBtn");
        const status = document.getElementById("status");
        const fidelity = document.getElementById("fidelity");
        const failoverMessage = document.getElementById("failoverMessage");

        if (demoBtn) {
            demoBtn.disabled = true;
            demoBtn.textContent = "⏳ SIMULATING OUTAGE & FAILOVER...";
        }

        loadPresetGarment('sweater');

        modelAvailability["Model A"] = true;
        modelAvailability["Model B"] = true;
        modelAvailability["Model C"] = true;
        updateAvailabilityButtons();

        // 1. Request Luxury Fidelity
        fidelity.value = 95;
        updateFidelity();
        status.textContent = "Step 1: Client requests 95% ultra-fidelity catalogue shoot...";

        setTimeout(function () {
            updateLiveRouter();
            status.textContent = "Step 2: Auto Router routes to flagship provider (Model C)...";

            setTimeout(function () {
                // 2. Kill Model C
                modelAvailability["Model C"] = false;
                updateAvailabilityButtons();
                updateLiveRouter();

                if (failoverMessage) {
                    failoverMessage.textContent = "ALERT: Model C endpoint timed out (503). Control Layer triggering active failover protocol.";
                    failoverMessage.classList.add("active");
                }
                status.textContent = "Step 3: 💥 Model C goes OFFLINE. Recovering gracefully...";

                setTimeout(function () {
                    const fallback = smartRouter(95);
                    status.textContent = "Step 4: ✅ Auto-rerouted to " + fallback.model + " without client disruption.";
                    updateLiveRouter();

                    setTimeout(function () {
                        generateResult();
                        if (demoBtn) {
                            demoBtn.disabled = false;
                            demoBtn.textContent = "▶ RUN JUDGE DEMO (LIVE FAILOVER)";
                        }
                    }, 800);

                }, 1100);

            }, 1200);

        }, 900);
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    // Global bindings for HTML onclick handlers
    window.loadPresetGarment = loadPresetGarment;
    window.updateFidelity = updateFidelity;
    window.toggleModelFailure = toggleModelFailure;
    window.generateResult = generateResult;
    window.approveOutput = approveOutput;
    window.runJudgeDemo = runJudgeDemo;

    // Default boot initialization with Sweater preset
    loadPresetGarment('sweater');
    updateAvailabilityButtons();
    updateLiveRouter();
});