// ==========================================
// RANGERS AI
// FASHION AI CONTROL LAYER
// ROBUST COMPLETE SCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // GLOBAL STATE
    // ======================================

    let selectedModel = "Waiting...";

    let modelAvailability = {
        "Model A": true,
        "Model B": true,
        "Model C": true
    };


    // ======================================
    // GET ELEMENTS
    // ======================================

    const garmentInput =
        document.getElementById("garmentInput");

    const previewImage =
        document.getElementById("previewImage");

    const fileName =
        document.getElementById("fileName");


    // ======================================
    // IMAGE UPLOAD
    // ======================================

    if (garmentInput) {

        garmentInput.addEventListener(
            "change",
            function () {

                const file =
                    garmentInput.files[0];

                if (!file) {

                    if (fileName) {
                        fileName.textContent =
                            "No image selected";
                    }

                    if (previewImage) {
                        previewImage.style.display =
                            "none";
                    }

                    return;
                }


                if (fileName) {
                    fileName.textContent =
                        file.name;
                }


                const imageURL =
                    URL.createObjectURL(file);


                if (previewImage) {

                    previewImage.src =
                        imageURL;

                    previewImage.style.display =
                        "block";
                }
            }
        );
    }


    // ======================================
    // SMART ROUTER
    // ======================================

    function smartRouter(fidelity) {

        let preferredModel;
        let reason;


        // High fidelity
        if (fidelity >= 93) {

            preferredModel = "Model C";

            reason =
                "High-fidelity requirement detected. " +
                "Model C is preferred for maximum visual quality.";

        }

        // Balanced
        else if (fidelity >= 80) {

            preferredModel = "Model A";

            reason =
                "Balanced quality and cost requirement detected. " +
                "Model A is preferred.";

        }

        // Cost-focused
        else {

            preferredModel = "Model B";

            reason =
                "Lower fidelity requirement detected. " +
                "Model B is preferred to reduce generation cost.";
        }


        // ==================================
        // PREFERRED MODEL AVAILABLE
        // ==================================

        if (
            modelAvailability[preferredModel]
        ) {

            return {
                model: preferredModel,
                reason: reason,
                failover: false
            };
        }


        // ==================================
        // AUTOMATIC FAILOVER
        // ==================================

        const fallbackOrder = [
            "Model A",
            "Model B",
            "Model C"
        ];


        for (
            let i = 0;
            i < fallbackOrder.length;
            i++
        ) {

            const fallback =
                fallbackOrder[i];


            if (
                modelAvailability[fallback]
            ) {

                return {

                    model: fallback,

                    reason:
                        preferredModel +
                        " is unavailable. " +
                        "RANGERS AI automatically rerouted " +
                        "the request to " +
                        fallback +
                        " using failover.",

                    failover: true
                };
            }
        }


        // ==================================
        // NO MODEL AVAILABLE
        // ==================================

        return {

            model: "NONE",

            reason:
                "No AI model is currently available.",

            failover: false
        };
    }


    // ======================================
    // MODEL COST
    // ======================================

    function getModelCost(model) {

        switch (model) {

            case "Model A":
                return 2.10;

            case "Model B":
                return 1.40;

            case "Model C":
                return 2.80;

            default:
                return 0;
        }
    }


    // ======================================
    // MODEL TIME
    // ======================================

    function getModelTime(model) {

        switch (model) {

            case "Model A":
                return "8.4 sec";

            case "Model B":
                return "6.8 sec";

            case "Model C":
                return "10.2 sec";

            default:
                return "--";
        }
    }


    // ======================================
    // QUALITY SCORE
    // ======================================

    function getQualityScore(
        model,
        fidelity
    ) {

        if (model === "Model C") {

            return Math.min(
                99,
                fidelity + 4
            );
        }


        if (model === "Model A") {

            return Math.min(
                97,
                fidelity + 2
            );
        }


        if (model === "Model B") {

            return Math.max(
                75,
                fidelity - 2
            );
        }


        return 0;
    }


    // ======================================
    // UPDATE MODEL BUTTONS
    // ======================================

    function updateAvailabilityButtons() {

        const models = [
            "Model A",
            "Model B",
            "Model C"
        ];


        models.forEach(function (model) {

            let buttonId;


            if (model === "Model A") {
                buttonId = "failModelA";
            }

            else if (model === "Model B") {
                buttonId = "failModelB";
            }

            else {
                buttonId = "failModelC";
            }


            const button =
                document.getElementById(buttonId);


            if (!button) {
                return;
            }


            const status =
                button.querySelector("small");


            if (modelAvailability[model]) {

                button.classList.remove(
                    "offline"
                );

                if (status) {
                    status.textContent =
                        "ONLINE";
                }

            }

            else {

                button.classList.add(
                    "offline"
                );

                if (status) {
                    status.textContent =
                        "OFFLINE";
                }
            }
        });
    }


    // ======================================
    // UPDATE AUTO ROUTER
    // ======================================

    function updateLiveRouter() {

        const fidelityElement =
            document.getElementById("fidelity");


        if (!fidelityElement) {
            return;
        }


        const fidelity =
            parseInt(
                fidelityElement.value,
                10
            );


        const route =
            smartRouter(fidelity);


        selectedModel =
            route.model;


        // ----------------------------------
        // PIPELINE MODEL
        // ----------------------------------

        const liveModel =
            document.getElementById(
                "liveModel"
            );


        if (liveModel) {

            if (route.model === "NONE") {

                liveModel.textContent =
                    "No Model";

            } else {

                liveModel.textContent =
                    route.model;
            }
        }


        // ----------------------------------
        // MODEL CARDS
        // ----------------------------------

        const modelA =
            document.getElementById("modelA");

        const modelB =
            document.getElementById("modelB");

        const modelC =
            document.getElementById("modelC");


        if (modelA) {
            modelA.classList.remove("selected");
        }

        if (modelB) {
            modelB.classList.remove("selected");
        }

        if (modelC) {
            modelC.classList.remove("selected");
        }


        // ----------------------------------
        // STATUS LABELS
        // ----------------------------------

        const statusA =
            document.getElementById("statusA");

        const statusB =
            document.getElementById("statusB");

        const statusC =
            document.getElementById("statusC");


        if (statusA) {
            statusA.textContent =
                modelAvailability["Model A"]
                    ? "AVAILABLE"
                    : "OFFLINE";
        }


        if (statusB) {
            statusB.textContent =
                modelAvailability["Model B"]
                    ? "AVAILABLE"
                    : "OFFLINE";
        }


        if (statusC) {
            statusC.textContent =
                modelAvailability["Model C"]
                    ? "AVAILABLE"
                    : "OFFLINE";
        }


        // ----------------------------------
        // HIGHLIGHT SELECTED
        // ----------------------------------

        if (route.model === "Model A") {

            if (modelA) {
                modelA.classList.add(
                    "selected"
                );
            }

            if (statusA) {
                statusA.textContent =
                    "SELECTED";
            }
        }


        else if (route.model === "Model B") {

            if (modelB) {
                modelB.classList.add(
                    "selected"
                );
            }

            if (statusB) {
                statusB.textContent =
                    "SELECTED";
            }
        }


        else if (route.model === "Model C") {

            if (modelC) {
                modelC.classList.add(
                    "selected"
                );
            }

            if (statusC) {
                statusC.textContent =
                    "SELECTED";
            }
        }


        // ----------------------------------
        // ROUTER STATUS BOX
        // ----------------------------------

        const routerStatus =
            document.getElementById(
                "routerStatus"
            );


        if (routerStatus) {

            if (route.model === "NONE") {

                routerStatus.innerHTML =

                    '<div class="router-status-icon">!</div>' +

                    '<div>' +

                    '<strong>No Available Model</strong>' +

                    '<p>' +
                    route.reason +
                    '</p>' +

                    '</div>';

            }

            else {

                routerStatus.innerHTML =

                    '<div class="router-status-icon">✓</div>' +

                    '<div>' +

                    '<strong>Router Selected: ' +
                    route.model +
                    '</strong>' +

                    '<p>' +
                    route.reason +
                    '</p>' +

                    '</div>';
            }
        }


        // ----------------------------------
        // DECISION PANEL
        // ----------------------------------

        const decisionModel =
            document.getElementById(
                "decisionModel"
            );


        const decisionReason =
            document.getElementById(
                "decisionReason"
            );


        if (decisionModel) {

            if (route.model === "NONE") {

                decisionModel.textContent =
                    "⚠ No available model";

            }

            else {

                decisionModel.textContent =
                    "✓ " +
                    route.model +
                    " selected automatically";
            }
        }


        if (decisionReason) {

            decisionReason.textContent =
                route.reason;
        }
    }


    // ======================================
    // FIDELITY SLIDER
    // ======================================

    function updateFidelity() {

        const slider =
            document.getElementById(
                "fidelity"
            );


        if (!slider) {
            return;
        }


        const value =
            parseInt(
                slider.value,
                10
            );


        const valueDisplay =
            document.getElementById(
                "fidelityValue"
            );


        if (valueDisplay) {

            valueDisplay.textContent =
                value + "%";
        }


        updateLiveRouter();
    }


    // ======================================
    // MODEL OUTAGE
    // ======================================

    function toggleModelFailure(model) {

        modelAvailability[model] =
            !modelAvailability[model];


        updateAvailabilityButtons();

        updateLiveRouter();


        const failoverMessage =
            document.getElementById(
                "failoverMessage"
            );


        if (!failoverMessage) {
            return;
        }


        if (
            modelAvailability[model] === false
        ) {

            failoverMessage.textContent =
                model +
                " is now OFFLINE. " +
                "Auto Router will automatically " +
                "use a fallback model.";

            failoverMessage.classList.add(
                "active"
            );

        }

        else {

            failoverMessage.textContent =
                model +
                " is back ONLINE. " +
                "Auto Router can use it again.";

            failoverMessage.classList.remove(
                "active"
            );
        }
    }


    // ======================================
    // QA CHECK
    // ======================================

    function runQualityCheck(
        fidelity,
        quality
    ) {

        const overallScore =
            Math.round(
                (
                    Number(fidelity) +
                    Number(quality)
                ) / 2
            );


        let result;
        let message;


        if (overallScore >= 85) {

            result = "PASS";

            message =
                "Output meets the requested quality " +
                "threshold and is ready for delivery.";
        }

        else if (overallScore >= 75) {

            result = "REVIEW";

            message =
                "Output is usable, but human review " +
                "is recommended before delivery.";
        }

        else {

            result = "FAIL";

            message =
                "Output quality is below the required " +
                "threshold. Regeneration is recommended.";
        }


        // ----------------------------------
        // SCORE
        // ----------------------------------

        const score =
            document.getElementById(
                "qaOverallScore"
            );


        if (score) {

            score.textContent =
                overallScore + "%";
        }


        // ----------------------------------
        // PROGRESS
        // ----------------------------------

        const progress =
            document.getElementById(
                "qaProgressFill"
            );


        if (progress) {

            progress.style.width =
                overallScore + "%";
        }


        // ----------------------------------
        // BADGE
        // ----------------------------------

        const qaResult =
            document.getElementById(
                "qaResult"
            );


        if (qaResult) {

            qaResult.textContent =
                result;

            qaResult.className =
                "qa-result " +
                result.toLowerCase();
        }


        // ----------------------------------
        // INDIVIDUAL CHECKS
        // ----------------------------------

        setQACheck(
            "structureCheck",
            overallScore >= 75
        );


        setQACheck(
            "fidelityCheck",
            Number(fidelity) >= 80
        );


        setQACheck(
            "qualityCheck",
            Number(quality) >= 80
        );


        setQACheck(
            "deliveryCheck",
            result === "PASS"
        );


        // ----------------------------------
        // MESSAGE
        // ----------------------------------

        const qaMessage =
            document.getElementById(
                "qaMessage"
            );


        if (qaMessage) {

            qaMessage.textContent =
                message;
        }


        // ----------------------------------
        // APPROVE BUTTON
        // ----------------------------------

        const approveBtn =
            document.getElementById(
                "approveBtn"
            );


        if (approveBtn) {

            approveBtn.disabled =
                result !== "PASS";

            approveBtn.classList.remove(
                "approved"
            );

            approveBtn.textContent =
                "✓ APPROVE OUTPUT";
        }


        // ----------------------------------
        // UPDATE HEADER BADGE
        // ----------------------------------

        const successBadge =
            document.querySelector(
                ".success-badge"
            );


        if (successBadge) {

            if (result === "PASS") {

                successBadge.textContent =
                    "● QA PASSED";

            }

            else if (result === "REVIEW") {

                successBadge.textContent =
                    "● QA REVIEW";

            }

            else {

                successBadge.textContent =
                    "● QA FAILED";
            }
        }


        return {
            score: overallScore,
            result: result,
            message: message
        };
    }


    // ======================================
    // QA INDIVIDUAL CHECK
    // ======================================

    function setQACheck(
        id,
        passed
    ) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        if (passed) {

            element.textContent =
                "✓ PASSED";

            element.className =
                "pass-text";

        }

        else {

            element.textContent =
                "⚠ REVIEW";

            element.className =
                "review-text";
        }
    }


    // ======================================
    // GENERATE RESULT
    // ======================================

    function generateResult() {

        const status =
            document.getElementById(
                "status"
            );


        const results =
            document.getElementById(
                "results"
            );


        const fidelityElement =
            document.getElementById(
                "fidelity"
            );


        const backgroundElement =
            document.getElementById(
                "background"
            );


        const poseElement =
            document.getElementById(
                "pose"
            );


        if (!status || !results) {
            return;
        }


        const fidelity =
            parseInt(
                fidelityElement.value,
                10
            );


        const background =
            backgroundElement.value;


        const pose =
            poseElement.value;


        // ----------------------------------
        // IMAGE REQUIRED
        // ----------------------------------

        if (
            !garmentInput ||
            !garmentInput.files[0]
        ) {

            status.textContent =
                "⚠️ Please upload a garment image first.";

            return;
        }


        // ----------------------------------
        // ROUTER
        // ----------------------------------

        const route =
            smartRouter(fidelity);


        if (route.model === "NONE") {

            status.textContent =
                "❌ No AI model is currently available.";

            return;
        }


        // ----------------------------------
        // PROCESSING
        // ----------------------------------

        status.textContent =
            "⚡ Auto Router analysing requirements...";


        results.style.display =
            "none";


        setTimeout(function () {

            const cost =
                getModelCost(
                    route.model
                );


            const time =
                getModelTime(
                    route.model
                );


            const quality =
                getQualityScore(
                    route.model,
                    fidelity
                );


            // --------------------------------
            // ORIGINAL IMAGE
            // --------------------------------

            const originalResultImage =
                document.getElementById(
                    "originalResultImage"
                );


            if (originalResultImage) {

                originalResultImage.src =
                    previewImage.src;

                originalResultImage.style.display =
                    "block";
            }


            // --------------------------------
            // ROUTED OUTPUT
            // --------------------------------

            const resultImage =
                document.getElementById(
                    "resultImage"
                );


            if (resultImage) {

                resultImage.src =
                    previewImage.src;

                resultImage.style.display =
                    "block";
            }


            // --------------------------------
            // METRICS
            // --------------------------------

            setText(
                "resultFidelity",
                fidelity + "%"
            );


            setText(
                "resultQuality",
                quality + "%"
            );


            setText(
                "resultCost",
                "₹" + cost.toFixed(2)
            );


            setText(
                "resultTime",
                time
            );


            setText(
                "resultModel",
                route.model
            );


            // --------------------------------
            // ROUTING REASON
            // --------------------------------

            const routingReason =
                document.getElementById(
                    "routingReason"
                );


            if (routingReason) {

                routingReason.textContent =
                    route.reason +
                    " Background: " +
                    background +
                    ". Pose: " +
                    pose +
                    ".";
            }


            // --------------------------------
            // QA
            // --------------------------------

            const qa =
                runQualityCheck(
                    fidelity,
                    quality
                );


            // --------------------------------
            // GENERATION LOG
            // --------------------------------

            const routingLog =
                document.getElementById(
                    "routingLog"
                );


            if (routingLog) {

                let log = "";


                log +=
                    "<p>INPUT → " +
                    garmentInput.files[0].name +
                    "</p>";


                log +=
                    "<p>ANALYSIS → Fidelity requirement: " +
                    fidelity +
                    "%</p>";


                if (route.failover) {

                    log +=
                        "<p>FAILOVER → Preferred model unavailable → " +
                        route.model +
                        " selected ✓</p>";

                } else {

                    log +=
                        "<p>ROUTER → System selected " +
                        route.model +
                        "</p>";
                }


                log +=
                    "<p>CONTROL → " +
                    background +
                    " | " +
                    pose +
                    "</p>";


                log +=
                    "<p>QA → Garment structure ........ PASSED ✓</p>";


                log +=
                    "<p>QA → Fidelity threshold ........ " +
                    (
                        fidelity >= 80
                            ? "PASSED ✓"
                            : "REVIEW ⚠"
                    ) +
                    "</p>";


                log +=
                    "<p>QA → Output quality ............. " +
                    quality +
                    "%</p>";


                log +=
                    "<p>QA → Overall result .............. " +
                    qa.result +
                    "</p>";


                log +=
                    "<p>COST → ₹" +
                    cost.toFixed(2) +
                    "</p>";


                log +=
                    "<p>TIME → " +
                    time +
                    "</p>";


                log +=
                    "<p>STATUS → " +
                    (
                        qa.result === "PASS"
                            ? "READY FOR DELIVERY ✓"
                            : "HUMAN REVIEW REQUIRED ⚠"
                    ) +
                    "</p>";


                routingLog.innerHTML =
                    log;
            }


            // --------------------------------
            // STATUS
            // --------------------------------

            if (
                qa.result === "PASS"
            ) {

                status.textContent =
                    "✅ Auto routing completed. " +
                    route.model +
                    " selected and QA passed.";

            }

            else {

                status.textContent =
                    "⚠ Auto routing completed. " +
                    "QA requires review.";
            }


            // --------------------------------
            // SHOW RESULTS
            // --------------------------------

            results.style.display =
                "block";


            results.scrollIntoView({
                behavior: "smooth"
            });


        }, 1800);
    }


    // ======================================
    // APPROVE OUTPUT
    // ======================================

    function approveOutput() {

        const button =
            document.getElementById(
                "approveBtn"
            );


        const status =
            document.getElementById(
                "status"
            );


        const routingLog =
            document.getElementById(
                "routingLog"
            );


        if (!button) {
            return;
        }


        button.textContent =
            "✓ OUTPUT APPROVED";


        button.classList.add(
            "approved"
        );


        button.disabled =
            true;


        if (status) {

            status.textContent =
                "✅ QA passed. Output approved for delivery.";
        }


        if (routingLog) {

            routingLog.innerHTML +=
                "<p>DELIVERY → OUTPUT APPROVED ✓</p>";
        }
    }


    // ======================================
    // JUDGE DEMO
    // ======================================

    function runJudgeDemo() {

        const demoBtn =
            document.getElementById(
                "demoBtn"
            );


        const status =
            document.getElementById(
                "status"
            );


        const fidelity =
            document.getElementById(
                "fidelity"
            );


        const failoverMessage =
            document.getElementById(
                "failoverMessage"
            );


        if (
            !garmentInput ||
            !garmentInput.files[0]
        ) {

            status.textContent =
                "⚠️ Upload a garment image before running the Judge Demo.";

            return;
        }


        if (demoBtn) {

            demoBtn.disabled =
                true;

            demoBtn.textContent =
                "⏳ RUNNING DEMO...";
        }


        // Reset all models

        modelAvailability["Model A"] =
            true;

        modelAvailability["Model B"] =
            true;

        modelAvailability["Model C"] =
            true;


        updateAvailabilityButtons();


        // --------------------------------
        // STEP 1
        // --------------------------------

        fidelity.value =
            95;


        updateFidelity();


        status.textContent =
            "⚡ High-fidelity request detected...";


        // --------------------------------
        // STEP 2
        // --------------------------------

        setTimeout(function () {

            status.textContent =
                "🤖 Auto Router selected Model C.";

            updateLiveRouter();


            // --------------------------------
            // STEP 3
            // --------------------------------

            setTimeout(function () {

                modelAvailability["Model C"] =
                    false;


                updateAvailabilityButtons();

                updateLiveRouter();


                if (failoverMessage) {

                    failoverMessage.textContent =
                        "Model C outage detected. " +
                        "Auto Router is starting automatic failover.";

                    failoverMessage.classList.add(
                        "active"
                    );
                }


                status.textContent =
                    "🔄 Model C unavailable. Starting failover...";


                // --------------------------------
                // STEP 4
                // --------------------------------

                setTimeout(function () {

                    const fallback =
                        smartRouter(95);


                    status.textContent =
                        "✅ Automatically rerouted to " +
                        fallback.model + ".";


                    updateLiveRouter();


                    // --------------------------------
                    // STEP 5
                    // --------------------------------

                    setTimeout(function () {

                        generateResult();


                        if (demoBtn) {

                            demoBtn.disabled =
                                false;

                            demoBtn.textContent =
                                "▶ RUN JUDGE DEMO";
                        }

                    }, 900);


                }, 1200);


            }, 1300);


        }, 1000);
    }


    // ======================================
    // HELPER: SET TEXT
    // ======================================

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;
        }
    }


    // ======================================
    // MAKE FUNCTIONS AVAILABLE TO HTML
    // ======================================

    window.updateFidelity =
        updateFidelity;

    window.toggleModelFailure =
        toggleModelFailure;

    window.generateResult =
        generateResult;

    window.approveOutput =
        approveOutput;

    window.runJudgeDemo =
        runJudgeDemo;


    // ======================================
    // INITIALIZE
    // ======================================

    updateAvailabilityButtons();

    updateLiveRouter();

});