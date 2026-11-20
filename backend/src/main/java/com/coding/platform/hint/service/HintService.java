package com.coding.platform.hint.service;

import java.util.List;

import com.coding.platform.hint.dto.HintResponse;

public interface HintService {

    List<HintResponse> getHintsByProblemId(Long problemId);
}