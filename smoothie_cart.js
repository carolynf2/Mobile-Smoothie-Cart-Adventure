class SmoothieCartGame {
    constructor() {
        this.gameData = {
            playerName: '',
            funds: 100,
            savingsJar: 0,
            day: 1,
            week: 1,
            totalProfit: 0,
            weeklyProfit: 0,
            customersServed: 0,
            achievements: []
        };
        
        this.expenseTracker = {
            ingredients: 0,
            gas: 0,
            marketing: 0,
            repairs: 0,
            dailyTotal: 0,
            weeklyTotal: 0
        };
        
        this.profitGoals = {
            daily: 50,
            weekly: 300,
            dailyAchieved: false,
            weeklyAchieved: false
        };
        
        this.upgrades = {
            fasterService: { name: 'Faster Service', cost: 150, owned: false, benefit: 'Serve 20% more customers' },
            premiumIngredients: { name: 'Premium Ingredients', cost: 200, owned: false, benefit: 'Higher prices accepted' },
            weatherProtection: { name: 'Weather Protection', cost: 100, owned: false, benefit: 'Less weather impact' },
            marketingBoost: { name: 'Marketing Boost', cost: 80, owned: false, benefit: 'Attract more customers' }
        };
        
        this.weather = {
            types: ['Sunny', 'Rainy', 'Cloudy', 'Hot'],
            current: 'Sunny',
            temperature: 25
        };
        
        this.locations = {
            beach: { name: 'Beach', cost: 15, customerMultiplier: 1.5, preferredWeather: ['Sunny', 'Hot'] },
            park: { name: 'Park', cost: 10, customerMultiplier: 1.2, preferredWeather: ['Sunny', 'Cloudy'] },
            school: { name: 'School', cost: 5, customerMultiplier: 1.0, preferredWeather: ['Cloudy', 'Rainy'] },
            office: { name: 'Office District', cost: 20, customerMultiplier: 1.3, preferredWeather: ['Cloudy', 'Sunny'] }
        };
        
        this.inventory = {
            strawberries: { name: 'Strawberries', count: 10, cost: 2, spoilage: 0.1 },
            bananas: { name: 'Bananas', count: 5, cost: 1.5, spoilage: 0.15 },
            ice: { name: 'Ice Cubes', count: 20, cost: 0.5, spoilage: 0.05 },
            cocoa: { name: 'Cocoa Powder', count: 0, cost: 3, spoilage: 0 }
        };
        
        this.menu = {
            strawberryBlast: { name: 'Strawberry Blast', ingredients: ['strawberries', 'ice'], price: 8, popularity: 0.7 },
            bananaSplit: { name: 'Banana Split', ingredients: ['bananas', 'ice'], price: 7, popularity: 0.6 },
            hotCocoa: { name: 'Hot Cocoa', ingredients: ['cocoa'], price: 5, popularity: 0.8, weatherDependent: 'Rainy' }
        };
        
        this.currentLocation = null;
        this.gameActive = false;
        this.marketingSpend = 0;
        this.emergencyFund = 0;
        
        this.initializeGame();
    }

    initializeGame() {
        this.updateWeatherForecast();
        this.setupEventListeners();
        this.updateUI();
        this.showScreen('setup');
    }

    setupEventListeners() {
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('startDayBtn').addEventListener('click', () => this.startDay());
        document.getElementById('simulateSalesBtn').addEventListener('click', () => this.simulateSales());
        document.getElementById('nextDayBtn').addEventListener('click', () => this.nextDay());
        
        document.getElementById('restockBtn').addEventListener('click', () => this.manageInventory());
        document.getElementById('setGoalBtn').addEventListener('click', () => this.setBudgetGoals());
        document.getElementById('setWeeklyGoalBtn').addEventListener('click', () => this.setWeeklyGoal());
        document.getElementById('addToSavingsBtn').addEventListener('click', () => this.addToSavings());
        document.getElementById('buyUpgradeBtn').addEventListener('click', () => this.showUpgrades());
        document.getElementById('setMarketingBtn').addEventListener('click', () => this.setMarketingBudget());
        document.getElementById('emergencyWithdrawBtn').addEventListener('click', () => this.emergencyWithdraw());
        
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.chooseLocation(e.target.dataset.location));
        });
        
        document.querySelectorAll('.menu-price').forEach(input => {
            input.addEventListener('change', (e) => this.updateMenuPrice(e.target.dataset.item, e.target.value));
        });
    }

    startGame() {
        const playerName = document.getElementById('playerNameInput').value.trim();
        if (!playerName) {
            alert('Please enter your cart name!');
            return;
        }
        
        this.gameData.playerName = playerName;
        this.gameActive = true;
        this.showScreen('planning');
        this.updateUI();
    }

    updateWeatherForecast() {
        const randomWeather = this.weather.types[Math.floor(Math.random() * this.weather.types.length)];
        this.weather.current = randomWeather;
        
        switch (randomWeather) {
            case 'Sunny':
                this.weather.temperature = 25 + Math.floor(Math.random() * 10);
                break;
            case 'Hot':
                this.weather.temperature = 30 + Math.floor(Math.random() * 8);
                break;
            case 'Rainy':
                this.weather.temperature = 15 + Math.floor(Math.random() * 10);
                break;
            case 'Cloudy':
                this.weather.temperature = 20 + Math.floor(Math.random() * 8);
                break;
        }
        
        this.updateWeatherDisplay();
    }

    updateWeatherDisplay() {
        const weatherEmoji = {
            'Sunny': '☀️',
            'Hot': '🌡️',
            'Rainy': '🌧️',
            'Cloudy': '☁️'
        };
        
        document.getElementById('currentWeather').textContent = 
            `${weatherEmoji[this.weather.current]} ${this.weather.current} | Temp: ${this.weather.temperature}°C`;
        
        const hoCocoaOption = document.getElementById('hoCocoaOption');
        hoCocoaOption.style.display = this.weather.current === 'Rainy' ? 'block' : 'none';
    }

    chooseLocation(locationKey) {
        this.currentLocation = locationKey;
        const location = this.locations[locationKey];
        
        document.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`[data-location="${locationKey}"]`).classList.add('selected');
        
        document.getElementById('movingCost').textContent = `$${location.cost}`;
        this.calculateMovingCosts(location);
    }

    calculateMovingCosts(location) {
        return location.cost;
    }

    updateMenuPrice(item, price) {
        if (this.menu[item]) {
            this.menu[item].price = parseFloat(price) || this.menu[item].price;
        }
    }

    manageInventory() {
        let totalCost = 0;
        
        Object.keys(this.inventory).forEach(key => {
            const checkbox = document.querySelector(`[data-restock="${key}"]`);
            if (checkbox && checkbox.checked) {
                const restockAmount = 10;
                this.inventory[key].count += restockAmount;
                totalCost += this.inventory[key].cost * restockAmount;
            }
        });
        
        if (totalCost > 0) {
            if (this.gameData.funds >= totalCost) {
                this.gameData.funds -= totalCost;
                this.expenseTracker.ingredients += totalCost;
                this.updateDailyExpenses();
                alert(`Restocked inventory for $${totalCost.toFixed(2)}`);
                this.updateUI();
            } else {
                alert('Not enough funds to restock!');
            }
        }
    }

    setBudgetGoals() {
        const goalInput = document.getElementById('dailyGoalInput');
        const newGoal = parseFloat(goalInput.value);
        
        if (newGoal && newGoal > 0) {
            this.profitGoals.daily = newGoal;
            document.getElementById('dailyGoal').textContent = `$${this.profitGoals.daily}`;
            alert(`Daily profit goal set to $${newGoal}!`);
        }
    }

    startDay() {
        if (!this.currentLocation) {
            alert('Please select a location first!');
            return;
        }
        
        this.showScreen('simulation');
    }

    simulateSales() {
        const location = this.locations[this.currentLocation];
        const salesData = this.performSalesSimulation(location);
        
        this.summarizeDay(salesData);
        this.updateProgression(salesData);
        this.showScreen('summary');
    }

    performSalesSimulation(location) {
        let revenue = 0;
        let customerCount = 0;
        let gasCost = location.cost;
        let marketingCost = this.marketingSpend;
        let repairsCost = Math.random() < 0.1 ? Math.floor(Math.random() * 30) + 10 : 0;
        let totalExpenses = gasCost + marketingCost + repairsCost;
        
        this.expenseTracker.gas += gasCost;
        this.expenseTracker.marketing += marketingCost;
        this.expenseTracker.repairs += repairsCost;
        this.updateDailyExpenses();
        
        let feedback = [];
        let popularFlavors = {};
        
        let baseCustomers = 20;
        
        if (this.upgrades.fasterService.owned) {
            baseCustomers *= 1.2;
        }
        if (this.upgrades.marketingBoost.owned) {
            baseCustomers *= 1.15;
        }
        
        baseCustomers += Math.floor(marketingCost / 5);
        
        const weatherMultiplier = this.upgrades.weatherProtection.owned ? 
            1.0 : (location.preferredWeather.includes(this.weather.current) ? 1.3 : 0.8);
        const totalCustomers = Math.floor(baseCustomers * location.customerMultiplier * weatherMultiplier);
        
        for (let i = 0; i < totalCustomers; i++) {
            const customer = this.generateCustomer();
            const sale = this.processCustomerSale(customer);
            
            if (sale.purchased) {
                revenue += sale.amount;
                customerCount++;
                popularFlavors[sale.item] = (popularFlavors[sale.item] || 0) + 1;
                
                if (Math.random() < 0.1) {
                    feedback.push(this.generateFeedback());
                }
            }
        }
        
        const netProfit = revenue - totalExpenses;
        this.gameData.funds += netProfit;
        this.gameData.totalProfit += Math.max(0, netProfit);
        this.gameData.weeklyProfit += Math.max(0, netProfit);
        this.gameData.customersServed += customerCount;
        
        if (repairsCost > 0) {
            feedback.push(`Your cart needed repairs costing $${repairsCost}!`);
        }
        
        return {
            revenue,
            expenses: totalExpenses,
            gasCost,
            marketingCost, 
            repairsCost,
            netProfit,
            customerCount,
            totalCustomers,
            feedback,
            popularFlavors
        };
    }

    generateCustomer() {
        const preferences = Object.keys(this.menu);
        const preferredItem = preferences[Math.floor(Math.random() * preferences.length)];
        const priceThreshold = 5 + Math.random() * 10;
        
        return { preferredItem, priceThreshold };
    }

    processCustomerSale(customer) {
        const item = this.menu[customer.preferredItem];
        
        if (!item) return { purchased: false };
        
        if (item.weatherDependent && item.weatherDependent !== this.weather.current) {
            return { purchased: false };
        }
        
        const hasIngredients = item.ingredients.every(ingredient => 
            this.inventory[ingredient] && this.inventory[ingredient].count > 0
        );
        
        if (!hasIngredients || item.price > customer.priceThreshold) {
            return { purchased: false };
        }
        
        item.ingredients.forEach(ingredient => {
            this.inventory[ingredient].count--;
        });
        
        return {
            purchased: true,
            amount: item.price,
            item: customer.preferredItem
        };
    }

    generateFeedback() {
        const feedbacks = [
            "Great smoothie!",
            "More variety please!",
            "Perfect for this weather!",
            "A bit pricey but worth it",
            "Love the fresh ingredients!"
        ];
        
        return feedbacks[Math.floor(Math.random() * feedbacks.length)];
    }

    summarizeDay(salesData) {
        document.getElementById('dayRevenue').textContent = `$${salesData.revenue.toFixed(2)}`;
        document.getElementById('dayExpenses').textContent = `$${salesData.expenses.toFixed(2)}`;
        document.getElementById('dayProfit').textContent = `$${salesData.netProfit.toFixed(2)}`;
        document.getElementById('customersServed').textContent = salesData.customerCount;
        
        const detailsElement = document.getElementById('expenseBreakdown');
        if (detailsElement) {
            detailsElement.innerHTML = `
                <p>🛣️ Gas/Transport: $${salesData.gasCost.toFixed(2)}</p>
                <p>📢 Marketing: $${salesData.marketingCost.toFixed(2)}</p>
                <p>🔧 Repairs: $${salesData.repairsCost.toFixed(2)}</p>
            `;
        }
        
        const mostPopular = Object.keys(salesData.popularFlavors).reduce((a, b) => 
            salesData.popularFlavors[a] > salesData.popularFlavors[b] ? a : b, 'None'
        );
        document.getElementById('popularFlavor').textContent = this.menu[mostPopular]?.name || 'None';
        
        const feedbackList = document.getElementById('customerFeedback');
        feedbackList.innerHTML = '';
        salesData.feedback.forEach(feedback => {
            const li = document.createElement('li');
            li.textContent = `"${feedback}"`;
            feedbackList.appendChild(li);
        });
        
        this.checkGoalAchievement(salesData);
        this.checkSpoilage();
    }

    checkSpoilage() {
        Object.keys(this.inventory).forEach(key => {
            const item = this.inventory[key];
            if (Math.random() < item.spoilage && item.count > 0) {
                const spoiled = Math.floor(item.count * 0.1) || 1;
                item.count = Math.max(0, item.count - spoiled);
            }
        });
    }

    updateProgression(salesData) {
        if (salesData.netProfit >= this.dailyGoal) {
            this.achievements.push(`Day ${this.gameData.day}: Met daily goal!`);
        }
        
        if (this.gameData.totalProfit >= 500 && !this.achievements.includes('$500 Profit Milestone')) {
            this.achievements.push('$500 Profit Milestone');
        }
        
        if (this.gameData.customersServed >= 100 && !this.achievements.includes('100 Customers Served')) {
            this.achievements.push('100 Customers Served');
        }
    }

    nextDay() {
        this.gameData.day++;
        
        if (this.gameData.day > 7) {
            this.gameData.week++;
            this.gameData.day = 1;
            this.gameData.weeklyProfit = 0;
            this.profitGoals.weeklyAchieved = false;
            this.expenseTracker.weeklyTotal = 0;
        }
        
        this.resetDailyExpenses();
        this.profitGoals.dailyAchieved = false;
        this.updateWeatherForecast();
        this.currentLocation = null;
        document.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('selected'));
        
        this.showScreen('planning');
        this.updateUI();
    }

    updateUI() {
        document.getElementById('currentFunds').textContent = `$${this.gameData.funds.toFixed(2)}`;
        document.getElementById('currentDay').textContent = `Day ${this.gameData.day}, Week ${this.gameData.week}`;
        document.getElementById('cartName').textContent = this.gameData.playerName || 'Your Cart';
        document.getElementById('dailyGoal').textContent = `$${this.profitGoals.daily}`;
        
        const savingsElement = document.getElementById('savingsJar');
        if (savingsElement) {
            savingsElement.textContent = `$${this.gameData.savingsJar.toFixed(2)}`;
        }
        
        const weeklyGoalElement = document.getElementById('weeklyGoal');
        if (weeklyGoalElement) {
            weeklyGoalElement.textContent = `$${this.profitGoals.weekly}`;
        }
        
        const weeklyProfitElement = document.getElementById('weeklyProfit');
        if (weeklyProfitElement) {
            weeklyProfitElement.textContent = `$${this.gameData.weeklyProfit.toFixed(2)}`;
        }
        
        Object.keys(this.inventory).forEach(key => {
            const countElement = document.getElementById(`${key}Count`);
            if (countElement) {
                countElement.textContent = this.inventory[key].count;
            }
        });
        
        Object.keys(this.menu).forEach(key => {
            const priceElement = document.getElementById(`${key}Price`);
            if (priceElement) {
                priceElement.value = this.menu[key].price;
            }
        });
        
        this.updateExpenseDisplay();
        this.updateWeatherDisplay();
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        document.getElementById(`${screenName}Screen`).style.display = 'block';
    }

    updateDailyExpenses() {
        this.expenseTracker.dailyTotal = this.expenseTracker.ingredients + 
            this.expenseTracker.gas + this.expenseTracker.marketing + this.expenseTracker.repairs;
        this.expenseTracker.weeklyTotal += this.expenseTracker.dailyTotal;
        this.updateExpenseDisplay();
    }

    updateExpenseDisplay() {
        const ingredientsElement = document.getElementById('dailyIngredients');
        const gasElement = document.getElementById('dailyGas');
        const marketingElement = document.getElementById('dailyMarketing');
        const repairsElement = document.getElementById('dailyRepairs');
        const totalElement = document.getElementById('dailyExpensesTotal');

        if (ingredientsElement) ingredientsElement.textContent = `$${this.expenseTracker.ingredients.toFixed(2)}`;
        if (gasElement) gasElement.textContent = `$${this.expenseTracker.gas.toFixed(2)}`;
        if (marketingElement) marketingElement.textContent = `$${this.expenseTracker.marketing.toFixed(2)}`;
        if (repairsElement) repairsElement.textContent = `$${this.expenseTracker.repairs.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${this.expenseTracker.dailyTotal.toFixed(2)}`;
    }

    setWeeklyGoal() {
        const weeklyGoalInput = document.getElementById('weeklyGoalInput');
        const newGoal = parseFloat(weeklyGoalInput.value);
        
        if (newGoal && newGoal > 0) {
            this.profitGoals.weekly = newGoal;
            document.getElementById('weeklyGoal').textContent = `$${this.profitGoals.weekly}`;
            alert(`Weekly profit goal set to $${newGoal}!`);
        }
    }

    addToSavings() {
        const savingsInput = document.getElementById('savingsInput');
        const amount = parseFloat(savingsInput.value);
        
        if (amount && amount > 0 && amount <= this.gameData.funds) {
            this.gameData.funds -= amount;
            this.gameData.savingsJar += amount;
            savingsInput.value = '';
            alert(`Added $${amount.toFixed(2)} to your savings jar!`);
            this.updateUI();
        } else {
            alert('Invalid amount or not enough funds!');
        }
    }

    emergencyWithdraw() {
        const withdrawInput = document.getElementById('emergencyInput');
        const amount = parseFloat(withdrawInput.value);
        
        if (amount && amount > 0 && amount <= this.gameData.savingsJar) {
            this.gameData.savingsJar -= amount;
            this.gameData.funds += amount;
            withdrawInput.value = '';
            alert(`Emergency withdrawal of $${amount.toFixed(2)} from savings!`);
            this.updateUI();
        } else {
            alert('Invalid amount or insufficient savings!');
        }
    }

    setMarketingBudget() {
        const marketingInput = document.getElementById('marketingInput');
        const amount = parseFloat(marketingInput.value) || 0;
        
        if (amount <= this.gameData.funds) {
            this.marketingSpend = amount;
            document.getElementById('marketingSpend').textContent = `$${amount}`;
            alert(`Marketing budget set to $${amount}!`);
        } else {
            alert('Not enough funds for that marketing budget!');
        }
    }

    showUpgrades() {
        const upgradesList = document.getElementById('upgradesList');
        upgradesList.innerHTML = '';
        
        Object.keys(this.upgrades).forEach(key => {
            const upgrade = this.upgrades[key];
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-item';
            upgradeElement.innerHTML = `
                <div class="upgrade-info">
                    <h4>${upgrade.name}</h4>
                    <p>${upgrade.benefit}</p>
                    <p class="upgrade-cost">Cost: $${upgrade.cost}</p>
                </div>
                <button class="upgrade-btn" ${upgrade.owned ? 'disabled' : ''} 
                    onclick="game.buyUpgrade('${key}')">
                    ${upgrade.owned ? 'Owned' : 'Buy'}
                </button>
            `;
            upgradesList.appendChild(upgradeElement);
        });
        
        document.getElementById('upgradesModal').style.display = 'block';
    }

    buyUpgrade(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        
        if (upgrade.owned) {
            alert('You already own this upgrade!');
            return;
        }
        
        if (this.gameData.savingsJar >= upgrade.cost) {
            this.gameData.savingsJar -= upgrade.cost;
            upgrade.owned = true;
            alert(`Purchased ${upgrade.name}! ${upgrade.benefit}`);
            this.showUpgrades();
            this.updateUI();
        } else {
            alert(`Not enough savings! You need $${upgrade.cost} but only have $${this.gameData.savingsJar} in savings.`);
        }
    }

    resetDailyExpenses() {
        this.expenseTracker.ingredients = 0;
        this.expenseTracker.gas = 0;
        this.expenseTracker.marketing = 0;
        this.expenseTracker.repairs = 0;
        this.expenseTracker.dailyTotal = 0;
        this.marketingSpend = 0;
    }

    checkGoalAchievement(salesData) {
        if (salesData.netProfit >= this.profitGoals.daily && !this.profitGoals.dailyAchieved) {
            this.profitGoals.dailyAchieved = true;
            this.achievements.push(`🎯 Daily goal achieved: $${this.profitGoals.daily}!`);
        }

        if (this.gameData.weeklyProfit >= this.profitGoals.weekly && !this.profitGoals.weeklyAchieved) {
            this.profitGoals.weeklyAchieved = true;
            this.achievements.push(`🏆 Weekly goal achieved: $${this.profitGoals.weekly}!`);
        }
    }
}

let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new SmoothieCartGame();
});