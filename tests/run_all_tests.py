import subprocess
import sys
import time

def run_command(name, command):
    print("\n" + "=" * 70)
    print(f"  RUNNING: {name}")
    print("=" * 70)
    start_time = time.time()
    result = subprocess.run(command, shell=True, text=True, capture_output=True)
    duration = time.time() - start_time
    
    print(result.stdout)
    if result.stderr:
        # print stderr if non-empty and not just warnings
        filtered_err = "\n".join([line for line in result.stderr.splitlines() if "DeprecationWarning" not in line and "warn" not in line.lower()])
        if filtered_err.strip():
            print("STDERR:", filtered_err)

    status = "PASSED" if result.returncode == 0 else "FAILED"
    print(f"\n>> {name}: {status} (took {duration:.2f}s)")
    return result.returncode == 0

def main():
    print("*" * 70)
    print("       GHARSEVA MASTER AUTOMATED TEST SUITE")
    print("       (Postman API Tests + Selenium E2E + Functional Verification)")
    print("*" * 70)

    summary = {}

    # 1. Postman API Test Suite via Newman
    postman_ok = run_command(
        "1. Postman API Collection (Newman)",
        "npx newman run tests/postman/GharSeva.postman_collection.json --reporters cli"
    )
    summary["Postman API Tests"] = postman_ok

    # 2. Functional & RBAC Matrix Tests
    functional_ok = run_command(
        "2. Functional Matrix & RBAC Verification",
        f'"{sys.executable}" tests/manual/test_functional_matrix.py'
    )
    summary["Functional & RBAC Tests"] = functional_ok

    # 3. Selenium E2E Browser Tests
    selenium_ok = run_command(
        "3. Selenium E2E Browser Suite (Headless Chrome)",
        f'"{sys.executable}" tests/selenium/test_suite.py'
    )
    summary["Selenium E2E Tests"] = selenium_ok

    print("\n" + "=" * 70)
    print("                   FINAL TEST EXECUTION SUMMARY")
    print("=" * 70)
    all_passed = True
    for suite, ok in summary.items():
        res_str = "✅ PASS" if ok else "❌ FAIL"
        if not ok:
            all_passed = False
        print(f"  - {suite:40} : {res_str}")

    print("=" * 70)
    if all_passed:
        print("🎉 ALL TESTS PASSED! System is fully verified and stable.")
        sys.exit(0)
    else:
        print("⚠️ SOME TESTS FAILED! Review outputs above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
