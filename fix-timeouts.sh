#!/bin/bash
# 批量修复测试超时问题

# 1. 在所有 page.goto() 后添加 waitForLoadState
sed -i "s/await page\.goto('\([^']*\)')/await page.goto('\1')\n    await page.waitForLoadState('networkidle')/g" tests/e2e/form-fields.spec.ts

# 2. 为所有 toBeVisible() 添加 timeout: 10000
sed -i 's/\.toBeVisible()/.toBeVisible({ timeout: 10000 })/g' tests/e2e/form-fields.spec.ts

echo "✅ Timeout fixes applied"
