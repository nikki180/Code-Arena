package com.coding.platform.hint.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.hint.dto.HintResponse;
import com.coding.platform.hint.entity.Hint;
import com.coding.platform.hint.repository.HintRepository;

@Service
@Transactional
public class HintServiceImpl implements HintService {

    private final HintRepository hintRepository;

    public HintServiceImpl(HintRepository hintRepository) {
        this.hintRepository = hintRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HintResponse> getHintsByProblemId(Long problemId) {

        return hintRepository
                .findByProblemIdOrderByHintNumberAsc(problemId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private HintResponse mapToResponse(Hint hint) {

        return HintResponse.builder()
                .id(hint.getId())
                .problemId(hint.getProblemId())
                .hintNumber(hint.getHintNumber())
                .hintText(hint.getHintText())
                .build();
    }
}