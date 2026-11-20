package com.coding.platform.judge.service;

import com.coding.platform.judge.dto.JudgeResult;
import com.coding.platform.submission.entity.ProgrammingLanguage;

public interface JudgeService {

    JudgeResult judge(
            Long problemId,
            ProgrammingLanguage language,
            String sourceCode
    );
}