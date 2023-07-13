import time
import os
import sys

def main():
    SLEEP_S = int(os.environ.get("SLEEP_S", "5"))
    print("Starting Job 5.3")
    # time.sleep(1)
    # print(f"Start Job & sleep {str(SLEEP_S)} seconds")
    # time.sleep(SLEEP_S) # Sleep for 3 seconds
    # print("Ending Job")
    # time.sleep(3)
    # print("Wait 1/5")
    # time.sleep(3)
    # print("Wait 2/5")
    # time.sleep(3)
    # print("Wait 3/5")
    # time.sleep(3)
    # print("Wait 4/5")
    # time.sleep(3)
    # print("Wait 5/5")
    time.sleep(1)
    print("Job Ended")
    sys.exit(0)

if __name__ == "__main__":
    main()