const puppeteer = require('puppeteer');

const BASE = 'http://localhost:3456';
const TEST_USER = {
  name: 'Test User',
  email: `test_${Date.now()}@example.com`,
  password: 'TestPass123',
};

let browser, page;
const results = [];

function log(test, status, detail = '') {
  const icon = status === 'PASS' ? '[PASS]' : '[FAIL]';
  const msg = `${icon} ${test}${detail ? ' - ' + detail : ''}`;
  console.log(msg);
  results.push({ test, status, detail });
}

async function setup() {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  page = await browser.newPage();
  page.setDefaultTimeout(10000);

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  return consoleErrors;
}

async function test1_pageLoads() {
  try {
    const response = await page.goto(BASE, { waitUntil: 'networkidle0' });
    if (response.status() === 200) {
      log('Page loads', 'PASS', `Status ${response.status()}`);
    } else {
      log('Page loads', 'FAIL', `Status ${response.status()}`);
    }
  } catch (e) {
    log('Page loads', 'FAIL', e.message);
  }
}

async function test2_authScreenVisible() {
  try {
    const authScreen = await page.$('#auth-screen');
    const isHidden = await page.$eval('#auth-screen', el => el.classList.contains('hidden'));
    if (authScreen && !isHidden) {
      log('Auth screen visible', 'PASS');
    } else {
      log('Auth screen visible', 'FAIL', 'Auth screen hidden or missing');
    }
  } catch (e) {
    log('Auth screen visible', 'FAIL', e.message);
  }
}

async function test3_appScreenHidden() {
  try {
    const isHidden = await page.$eval('#app-screen', el => el.classList.contains('hidden'));
    if (isHidden) {
      log('App screen hidden when logged out', 'PASS');
    } else {
      log('App screen hidden when logged out', 'FAIL', 'App screen is visible');
    }
  } catch (e) {
    log('App screen hidden when logged out', 'FAIL', e.message);
  }
}

async function test4_switchToRegister() {
  try {
    // Login form should be visible initially
    const loginVisible = await page.$eval('#login-form', el => !el.classList.contains('hidden'));
    const registerHidden = await page.$eval('#register-form', el => el.classList.contains('hidden'));

    if (!loginVisible || !registerHidden) {
      log('Switch to register form', 'FAIL', 'Initial state wrong');
      return;
    }

    // Click "Sign Up" link
    await page.evaluate(() => showRegister());
    await new Promise(r => setTimeout(r, 300));

    const loginHidden = await page.$eval('#login-form', el => el.classList.contains('hidden'));
    const registerVisible = await page.$eval('#register-form', el => !el.classList.contains('hidden'));

    if (loginHidden && registerVisible) {
      log('Switch to register form', 'PASS');
    } else {
      log('Switch to register form', 'FAIL', `login hidden: ${loginHidden}, register visible: ${registerVisible}`);
    }
  } catch (e) {
    log('Switch to register form', 'FAIL', e.message);
  }
}

async function test5_registerValidation() {
  try {
    // Try registering with weak password
    await page.$eval('#reg-name', el => el.value = '');
    await page.type('#reg-name', 'Test');
    await page.$eval('#reg-email', el => el.value = '');
    await page.type('#reg-email', 'bad@test.com');
    await page.$eval('#reg-password', el => el.value = '');
    await page.type('#reg-password', 'weak');

    await page.evaluate(() => handleRegister());
    await new Promise(r => setTimeout(r, 500));

    const errorVisible = await page.$eval('#register-error', el => !el.classList.contains('hidden'));
    const errorText = await page.$eval('#register-error', el => el.textContent);

    if (errorVisible && errorText.toLowerCase().includes('password')) {
      log('Register validation (weak password)', 'PASS', errorText);
    } else {
      log('Register validation (weak password)', 'FAIL', `Error visible: ${errorVisible}, text: ${errorText}`);
    }
  } catch (e) {
    log('Register validation (weak password)', 'FAIL', e.message);
  }
}

async function test6_registerSuccess() {
  try {
    await page.$eval('#reg-name', el => el.value = '');
    await page.type('#reg-name', TEST_USER.name);
    await page.$eval('#reg-email', el => el.value = '');
    await page.type('#reg-email', TEST_USER.email);
    await page.$eval('#reg-password', el => el.value = '');
    await page.type('#reg-password', TEST_USER.password);

    await page.evaluate(() => handleRegister());
    await new Promise(r => setTimeout(r, 2000));

    // After registration, app screen should show
    const authHidden = await page.$eval('#auth-screen', el => el.classList.contains('hidden'));
    const appVisible = await page.$eval('#app-screen', el => !el.classList.contains('hidden'));

    if (authHidden && appVisible) {
      log('Register success', 'PASS', `User: ${TEST_USER.email}`);
    } else {
      // Check if there was an error
      const errorText = await page.$eval('#register-error', el => el.textContent).catch(() => '');
      log('Register success', 'FAIL', `auth hidden: ${authHidden}, app visible: ${appVisible}, error: ${errorText}`);
    }
  } catch (e) {
    log('Register success', 'FAIL', e.message);
  }
}

async function test7_recipesLoad() {
  try {
    await new Promise(r => setTimeout(r, 2000));

    const recipeCards = await page.$$('#recipe-grid > div');
    if (recipeCards.length > 0) {
      log('Recipes loaded', 'PASS', `${recipeCards.length} recipe cards`);
    } else {
      const gridHtml = await page.$eval('#recipe-grid', el => el.innerHTML.substring(0, 200));
      log('Recipes loaded', 'FAIL', `No cards found. Grid: ${gridHtml}`);
    }
  } catch (e) {
    log('Recipes loaded', 'FAIL', e.message);
  }
}

async function test8_filtersPopulated() {
  try {
    const cuisineOptions = await page.$$eval('#filter-cuisine option', opts => opts.length);
    const dietaryOptions = await page.$$eval('#filter-dietary option', opts => opts.length);

    if (cuisineOptions > 1 && dietaryOptions > 1) {
      log('Filters populated', 'PASS', `${cuisineOptions} cuisines, ${dietaryOptions} dietary options`);
    } else {
      log('Filters populated', 'FAIL', `cuisines: ${cuisineOptions}, dietary: ${dietaryOptions}`);
    }
  } catch (e) {
    log('Filters populated', 'FAIL', e.message);
  }
}

async function test9_recipeSearch() {
  try {
    await page.$eval('#recipe-search', el => el.value = '');
    await page.type('#recipe-search', 'chicken');
    await new Promise(r => setTimeout(r, 1000));

    const recipeCards = await page.$$('#recipe-grid > div');
    // Check that at least one recipe name or description relates to chicken
    const names = await page.$$eval('#recipe-grid h3', els => els.map(e => e.textContent.toLowerCase()));
    const allText = await page.$eval('#recipe-grid', el => el.textContent.toLowerCase());
    const hasChicken = names.some(n => n.includes('chicken')) || allText.includes('chicken');

    if (recipeCards.length > 0 && hasChicken) {
      log('Recipe search', 'PASS', `${recipeCards.length} results, found chicken`);
    } else {
      log('Recipe search', 'FAIL', `${recipeCards.length} cards, hasChicken: ${hasChicken}`);
    }

    // Clear search
    await page.$eval('#recipe-search', el => el.value = '');
    await page.evaluate(() => loadRecipes());
    await new Promise(r => setTimeout(r, 1000));
  } catch (e) {
    log('Recipe search', 'FAIL', e.message);
  }
}

async function test10_recipeModal() {
  try {
    // Click first recipe card
    const firstCard = await page.$('#recipe-grid > div');
    if (!firstCard) {
      log('Recipe modal', 'FAIL', 'No recipe cards to click');
      return;
    }

    await firstCard.click();
    await new Promise(r => setTimeout(r, 500));

    const modalVisible = await page.$eval('#recipe-modal', el => !el.classList.contains('hidden'));
    const modalContent = await page.$eval('#recipe-modal-content', el => el.innerHTML.length);

    if (modalVisible && modalContent > 100) {
      log('Recipe modal opens', 'PASS');
    } else {
      log('Recipe modal opens', 'FAIL', `visible: ${modalVisible}, content length: ${modalContent}`);
    }

    // Close modal
    await page.evaluate(() => closeRecipeModal());
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    log('Recipe modal opens', 'FAIL', e.message);
  }
}

async function test11_tabSwitching() {
  try {
    const tabs = ['shopping', 'stores', 'chat', 'recipes'];
    let allPassed = true;

    for (const tab of tabs) {
      await page.evaluate(t => switchTab(t), tab);
      await new Promise(r => setTimeout(r, 300));

      const tabVisible = await page.$eval(`#tab-${tab}`, el => !el.classList.contains('hidden'));
      if (!tabVisible) {
        allPassed = false;
        log('Tab switching', 'FAIL', `Tab ${tab} did not become visible`);
        break;
      }
    }

    if (allPassed) {
      log('Tab switching', 'PASS', 'All 4 tabs switch correctly');
    }
  } catch (e) {
    log('Tab switching', 'FAIL', e.message);
  }
}

async function test12_profileModal() {
  try {
    await page.evaluate(() => showProfile());
    await new Promise(r => setTimeout(r, 1000));

    const modalVisible = await page.$eval('#profile-modal', el => !el.classList.contains('hidden'));
    const nameValue = await page.$eval('#profile-name', el => el.value);

    if (modalVisible && nameValue === TEST_USER.name) {
      log('Profile modal', 'PASS', `Name: ${nameValue}`);
    } else {
      log('Profile modal', 'FAIL', `visible: ${modalVisible}, name: "${nameValue}"`);
    }

    // Close
    await page.evaluate(() => closeProfile());
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    log('Profile modal', 'FAIL', e.message);
  }
}

async function test13_userNameDisplayed() {
  try {
    const displayedName = await page.$eval('#user-name', el => el.textContent);
    const avatarLetter = await page.$eval('#avatar-btn', el => el.textContent);

    if (displayedName === TEST_USER.name && avatarLetter === 'T') {
      log('User name displayed', 'PASS', `Name: ${displayedName}, Avatar: ${avatarLetter}`);
    } else {
      log('User name displayed', 'FAIL', `Name: "${displayedName}", Avatar: "${avatarLetter}"`);
    }
  } catch (e) {
    log('User name displayed', 'FAIL', e.message);
  }
}

async function test14_logout() {
  try {
    await page.evaluate(() => logout());
    await new Promise(r => setTimeout(r, 1000));

    const authVisible = await page.$eval('#auth-screen', el => !el.classList.contains('hidden'));
    const appHidden = await page.$eval('#app-screen', el => el.classList.contains('hidden'));

    if (authVisible && appHidden) {
      log('Logout', 'PASS');
    } else {
      log('Logout', 'FAIL', `auth visible: ${authVisible}, app hidden: ${appHidden}`);
    }
  } catch (e) {
    log('Logout', 'FAIL', e.message);
  }
}

async function test15_loginWithOtp() {
  try {
    // Make sure we're on login form
    await page.evaluate(() => showLogin());
    await new Promise(r => setTimeout(r, 300));

    await page.$eval('#login-email', el => el.value = '');
    await page.type('#login-email', TEST_USER.email);
    await page.$eval('#login-password', el => el.value = '');
    await page.type('#login-password', TEST_USER.password);

    // Intercept the login response to get _dev_otp
    const loginResponsePromise = page.waitForResponse(
      res => res.url().includes('/api/auth/login') && res.status() === 200
    );

    await page.evaluate(() => handleLogin());

    const loginResponse = await loginResponsePromise;
    const loginData = await loginResponse.json();

    if (!loginData.requires_otp) {
      log('Login with OTP', 'FAIL', 'Login did not request OTP');
      return;
    }

    const devOtp = loginData._dev_otp;
    if (!devOtp) {
      log('Login with OTP', 'FAIL', 'No _dev_otp in response');
      return;
    }

    await new Promise(r => setTimeout(r, 500));

    // OTP form should be visible
    const otpFormVisible = await page.$eval('#otp-form', el => !el.classList.contains('hidden'));
    if (!otpFormVisible) {
      log('Login with OTP', 'FAIL', 'OTP form not shown');
      return;
    }

    // Enter OTP code
    await page.$eval('#otp-code', el => el.value = '');
    await page.type('#otp-code', devOtp);

    // Verify OTP
    const verifyResponsePromise = page.waitForResponse(
      res => res.url().includes('/api/auth/verify-otp')
    );

    await page.evaluate(() => handleVerifyOtp());
    await verifyResponsePromise;
    await new Promise(r => setTimeout(r, 2000));

    // Should be in app now
    const authHidden = await page.$eval('#auth-screen', el => el.classList.contains('hidden'));
    const appVisible = await page.$eval('#app-screen', el => !el.classList.contains('hidden'));

    if (authHidden && appVisible) {
      log('Login with OTP', 'PASS', `OTP code: ${devOtp}`);
    } else {
      const otpError = await page.$eval('#otp-error', el => el.textContent).catch(() => '');
      log('Login with OTP', 'FAIL', `auth hidden: ${authHidden}, app visible: ${appVisible}, error: ${otpError}`);
    }
  } catch (e) {
    log('Login with OTP', 'FAIL', e.message);
  }
}

async function test16_cuisineFilter() {
  try {
    await page.evaluate(() => switchTab('recipes'));
    await new Promise(r => setTimeout(r, 500));

    // Select Italian cuisine
    await page.select('#filter-cuisine', 'Italian');
    await new Promise(r => setTimeout(r, 1000));

    const origins = await page.$$eval('#recipe-grid .text-brand-600.font-medium', els =>
      els.map(e => e.textContent.trim())
    );
    const allItalian = origins.length > 0 && origins.every(o => o === 'Italian');

    if (allItalian) {
      log('Cuisine filter', 'PASS', `${origins.length} Italian recipes`);
    } else {
      log('Cuisine filter', 'FAIL', `Origins: ${origins.slice(0, 5).join(', ')}`);
    }

    // Reset filter
    await page.select('#filter-cuisine', '');
    await new Promise(r => setTimeout(r, 500));
  } catch (e) {
    log('Cuisine filter', 'FAIL', e.message);
  }
}

async function test17_shoppingList() {
  try {
    // Load recipes first
    await page.evaluate(() => { switchTab('recipes'); loadRecipes(); });
    await new Promise(r => setTimeout(r, 1000));

    // Click first recipe
    const firstCard = await page.$('#recipe-grid > div');
    if (!firstCard) {
      log('Shopping list', 'FAIL', 'No recipe cards');
      return;
    }
    await firstCard.click();
    await new Promise(r => setTimeout(r, 500));

    // Click Shopping List button in the modal
    const shoppingBtn = await page.$('button[onclick^="viewShoppingList"]');
    if (!shoppingBtn) {
      log('Shopping list', 'FAIL', 'No shopping list button in modal');
      await page.evaluate(() => closeRecipeModal());
      return;
    }

    await shoppingBtn.click();
    await new Promise(r => setTimeout(r, 1500));

    // Should be on shopping tab with content
    const shoppingContent = await page.$eval('#shopping-content', el => !el.classList.contains('hidden'));
    const ingredients = await page.$$('#shopping-content input[type="checkbox"]');

    if (shoppingContent && ingredients.length > 0) {
      log('Shopping list', 'PASS', `${ingredients.length} ingredients displayed`);
    } else {
      log('Shopping list', 'FAIL', `visible: ${shoppingContent}, ingredients: ${ingredients.length}`);
    }
  } catch (e) {
    log('Shopping list', 'FAIL', e.message);
  }
}

async function test18_jsErrors(consoleErrors) {
  // Filter out expected errors:
  // - 401 from initial profile check when not logged in
  // - 400 from intentional validation tests
  const unexpected = consoleErrors.filter(e =>
    !e.includes('401') && !e.includes('400')
  );
  if (unexpected.length === 0) {
    log('No unexpected JS errors', 'PASS', `${consoleErrors.length} expected error(s) filtered`);
  } else {
    log('No unexpected JS errors', 'FAIL', unexpected.join(' | '));
  }
}

async function test19_clickRegisterButton() {
  // Test the specific known issue: clicking the Sign Up button in the UI
  try {
    // Go back to auth screen
    await page.evaluate(() => logout());
    await new Promise(r => setTimeout(r, 1000));

    // Click the "Sign Up" link text to switch to register form
    const signUpLink = await page.$('a[onclick="showRegister()"]');
    if (!signUpLink) {
      log('Click Sign Up link', 'FAIL', 'Sign Up link not found');
      return;
    }

    await signUpLink.click();
    await new Promise(r => setTimeout(r, 300));

    const registerVisible = await page.$eval('#register-form', el => !el.classList.contains('hidden'));

    if (registerVisible) {
      log('Click Sign Up link', 'PASS');
    } else {
      log('Click Sign Up link', 'FAIL', 'Register form not shown after click');
    }

    // Now try clicking the "Create Account" button with filled fields
    const uniqueEmail = `click_test_${Date.now()}@example.com`;
    await page.$eval('#reg-name', el => el.value = '');
    await page.type('#reg-name', 'Click Test');
    await page.$eval('#reg-email', el => el.value = '');
    await page.type('#reg-email', uniqueEmail);
    await page.$eval('#reg-password', el => el.value = '');
    await page.type('#reg-password', 'ClickTest1');

    // Click the actual Create Account button (not calling JS function)
    const createBtn = await page.$('#register-form button[onclick="handleRegister()"]');
    if (!createBtn) {
      log('Click Create Account button', 'FAIL', 'Button not found');
      return;
    }

    await createBtn.click();
    await new Promise(r => setTimeout(r, 2000));

    const authHidden = await page.$eval('#auth-screen', el => el.classList.contains('hidden'));
    const appVisible = await page.$eval('#app-screen', el => !el.classList.contains('hidden'));

    if (authHidden && appVisible) {
      log('Click Create Account button', 'PASS', `Registered ${uniqueEmail}`);
    } else {
      const errText = await page.$eval('#register-error', el => el.textContent).catch(() => '');
      log('Click Create Account button', 'FAIL', `auth hidden: ${authHidden}, app visible: ${appVisible}, error: ${errText}`);
    }
  } catch (e) {
    log('Click Create Account button', 'FAIL', e.message);
  }
}

async function test20_clickSignInButton() {
  try {
    // Logout first
    await page.evaluate(() => logout());
    await new Promise(r => setTimeout(r, 1000));

    // Fill in login form
    await page.$eval('#login-email', el => el.value = '');
    await page.type('#login-email', TEST_USER.email);
    await page.$eval('#login-password', el => el.value = '');
    await page.type('#login-password', TEST_USER.password);

    // Click the Sign In button
    const signInBtn = await page.$('#login-form button[onclick="handleLogin()"]');
    if (!signInBtn) {
      log('Click Sign In button', 'FAIL', 'Button not found');
      return;
    }

    const loginResponsePromise = page.waitForResponse(
      res => res.url().includes('/api/auth/login')
    );

    await signInBtn.click();
    const loginResponse = await loginResponsePromise;
    const loginData = await loginResponse.json();

    if (loginData.requires_otp) {
      log('Click Sign In button', 'PASS', 'Login API called, OTP requested');
    } else {
      log('Click Sign In button', 'FAIL', 'Unexpected response');
    }
  } catch (e) {
    log('Click Sign In button', 'FAIL', e.message);
  }
}

// ====================
// Run all tests
// ====================
(async () => {
  console.log('\n========================================');
  console.log('SmartChef Puppeteer E2E Test Suite');
  console.log('========================================\n');

  const consoleErrors = await setup();

  await test1_pageLoads();
  await test2_authScreenVisible();
  await test3_appScreenHidden();
  await test4_switchToRegister();
  await test5_registerValidation();
  await test6_registerSuccess();
  await test7_recipesLoad();
  await test8_filtersPopulated();
  await test9_recipeSearch();
  await test10_recipeModal();
  await test11_tabSwitching();
  await test12_profileModal();
  await test13_userNameDisplayed();
  await test14_logout();
  await test15_loginWithOtp();
  await test16_cuisineFilter();
  await test17_shoppingList();
  await test18_jsErrors(consoleErrors);
  await test19_clickRegisterButton();
  await test20_clickSignInButton();

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log('\n========================================');
  console.log(`Results: ${passed} passed, ${failed} failed, ${results.length} total`);
  console.log('========================================\n');

  if (failed > 0) {
    console.log('FAILURES:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  - ${r.test}: ${r.detail}`);
    });
    console.log('');
  }

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
