#!/bin/bash

set -e
trap 'echo "Something went wrong. Exiting."' ERR

DEFAULT_COMMIT_MSG="Some bugs are fixed"
DEFAULT_REMOTE_URL="#"
DEFAULT_BRANCH="main"

commit_msg="${1:-DEFAULT_COMMIT_MSG}"
remote_url="${2:-DEFAULT_REMOTE_URL}"
branch="${3:-DEFAULT_BRANCH}"

echo "Commit message: $commit_msg"
echo "Remote URL: $remote_url"
echo "Branch: $branch"

git add .

git commit -m "$commit_msg"

if ! git remote get-url origin &> /dev/null; then
  echo "Setting remote URL: $remote_url"
  git remote add origin "$remote_url"
else
  current_url=$(git remote get-url origin)
  echo "Remote already set: $current_url"
fi

git push origin "$branch"