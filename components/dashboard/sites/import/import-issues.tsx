import { AlertTriangle } from "lucide-react";
import { IMPORT_MAX_VISIBLE_ISSUES } from "@/lib/sites/constants";
import type { ImportIssue } from "@/lib/sites/types";

type ImportIssuesProps = {
  issues: ImportIssue[];
};

const ImportIssues = ({ issues }: ImportIssuesProps) => (
  <div className="issues" role="alert">
    <div className="issues-head">
      <AlertTriangle size={16} />
      <div>
        <strong>
          Import rejected &mdash; {issues.length}{" "}
          {issues.length === 1 ? "problem" : "problems"} found
        </strong>
        <span>Fix the file and upload it again. No rows were imported.</span>
      </div>
    </div>
    <ul>
      {issues.slice(0, IMPORT_MAX_VISIBLE_ISSUES).map((issue, index) => (
        <li key={index}>
          <b>{issue.row === null ? "File" : `Row ${issue.row}`}</b>
          <span>{issue.message}</span>
        </li>
      ))}
    </ul>
    {issues.length > IMPORT_MAX_VISIBLE_ISSUES && (
      <p>and {issues.length - IMPORT_MAX_VISIBLE_ISSUES} more&hellip;</p>
    )}
  </div>
);

export default ImportIssues;
