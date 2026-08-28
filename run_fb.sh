
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch --env-filter '
while read -r commit date; do
    if [ "$GIT_COMMIT" = "$commit" ]; then
        export GIT_AUTHOR_DATE="$date"
        export GIT_COMMITTER_DATE="$date"
    fi
done < /c/Kuliah/PROJECT/myportofolio/commit_dates_map.txt
' --force --all
