# .githooks/_common.sh
# Shared colour variables and print helpers.
# Source this file after setting HOOK_NAME, e.g.:
#   HOOK_NAME=pre-commit
#   . "$(dirname "$0")/_common.sh"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

_TAG="${HOOK_NAME:-hook}"
print_info()    { printf "${BLUE}[%s]${NC} %s\n"   "$_TAG" "$1"; }
print_success() { printf "${GREEN}[%s]${NC} %s\n"  "$_TAG" "$1"; }
print_warning() { printf "${YELLOW}[%s]${NC} %s\n" "$_TAG" "$1"; }
print_error()   { printf "${RED}[%s]${NC} %s\n"    "$_TAG" "$1"; }
